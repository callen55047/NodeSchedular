import express from 'express'
import { getUserFromRequest } from '../shared/RequestContext.js'
import Account from '../../models/Account.js'
import StripeManager from '../../internal/payments/StripeManager.js'
import Session from '../../models/Session.js'
import PriceManager from '../../internal/payments/PriceManager.js'
import Transaction from '../../models/Transaction.js'
import TransactionsManager from '../../internal/payments/TransactionsManager.js'
import Auditor from '../../internal/Auditor.js'
import Logger from '../../internal/Logger.js'
import AccountInterface from '../../models/interfaces/AccountInterface.js'
import PushNotification from '../../internal/controllers/PushNotification.js'

const router = express.Router()

/**
 * All of these transactions will be made from the user perspective
 * artist is the one receiving payments
 */
router.get('/session/price/:session_id', async (req, res) => {
  try {
    const session_id = req.params.session_id
    const session = await Session.findById(session_id)

    const deposit = PriceManager.depositChargeDetails(session!)
    const remainder = PriceManager.remainderChargeDetails(session!)
    const payment = PriceManager.paymentChargeDetails(session!)

    return res.status(200).json({ deposit, remainder, payment })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while getting price for session' })
  }
})

router.post('/session/intent', async (req, res) => {
  try {
    const { session_id, type } = req.body
    const user = getUserFromRequest(req)
    const session = await Session.findById(session_id)
    const artist = await Account.findById(session!.artist_id)
    const stripe = await StripeManager.getStripeClient()
    const transactionType = TransactionsManager.parseType(type)

    if (session!.cancelled_at) {
      return res.status(400).json({ error: 'Session has been cancelled' })
    }

    if (!transactionType) {
      return res.status(400).json({ error: 'Invalid transaction type for this operation' })
    }

    const artistCanReceivePayments = await AccountInterface.hasChargesEnabled(artist!)
    if (!artistCanReceivePayments) {
      return res.status(400).json({ error: 'Artist account is not setup to receive payments' })
    }

    let openIntentTransaction = await TransactionsManager.findOpenIntent(session!, transactionType)
    if (openIntentTransaction) {
      const stripeIntent = await stripe.paymentIntents.retrieve(openIntentTransaction.stripe_intent_id)

      // check for previous payment attempt not recorded
      if (stripeIntent.status === 'succeeded') {
        Auditor(session!._id).confirm(stripeIntent).payment(openIntentTransaction!.type)
        openIntentTransaction = await Transaction.findByIdAndUpdate(openIntentTransaction!._id, {
          stripe_payment_success: true,
          updated_at: new Date()
        }, { new: true })
      }

      return res.status(200).json({
        transaction: openIntentTransaction,
        client_secret: stripeIntent.client_secret
      })
    }

    const platformCharge = PriceManager.priceForTypeInCents(session!, transactionType)
    const { amount, application_fee_amount } = platformCharge
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
      transfer_data: { destination: artist!.stripe_id },
      application_fee_amount
    })

    const transaction = await new Transaction({
      stripe_intent_id: paymentIntent.id,
      sender_id: user._id,
      receiver_id: artist!._id,
      product_id: session!._id,
      type: transactionType
    }).save()

    Auditor(session!._id).intent(platformCharge)

    return res.status(201).json({
      transaction,
      client_secret: paymentIntent.client_secret
    })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while creating deposit intent' })
  }
})

router.post('/session/confirm-payment', async (req, res) => {
  try {
    const { transaction_id } = req.body
    const user = getUserFromRequest(req)
    const transaction = await Transaction.findById(transaction_id)
    const session = await Session.findById(transaction!.product_id)
    const artist = await Account.findById(transaction!.receiver_id)
    const stripe = await StripeManager.getStripeClient()
    const stripeIntent = await stripe.paymentIntents.retrieve(transaction!.stripe_intent_id)

    if (stripeIntent.status !== 'succeeded') {
      Auditor(session!._id).confirm(stripeIntent).failed(transaction!.type)

      return res.status(400).json({
        error: 'Stripe intent status not completed',
        status: stripeIntent.status
      })
    }

    const updated_at = new Date()
    const updatedTransaction = await Transaction.findByIdAndUpdate(transaction!._id, {
      stripe_payment_success: true,
      updated_at
    }, { new: true })

    Auditor(session!._id).confirm(stripeIntent).payment(updatedTransaction!.type)

    const pnController = PushNotification()
    await pnController
      .to(user)
      .from(artist!)
      .receipt
      .session(session!, updatedTransaction!)

    const normalizedPrice = Number((stripeIntent.amount / 100).toFixed(2))
    await pnController
      .to(artist!)
      .from(user)
      .session
      .paymentMadeForArtist(transaction!.type, normalizedPrice)

    return res.status(200).json({ transaction: updatedTransaction })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while confirming session payment' })
  }
})

/**
 * returns all transactions for user of request
 * can be artist, or user
 */
router.get('/all', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const transactions = await Transaction.find({
      $or: [
        { sender_id: user._id },
        { receiver_id: user._id }
      ]
    })

    return res.status(200).json({ transactions })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while creating payment intent' })
  }
})

export default router