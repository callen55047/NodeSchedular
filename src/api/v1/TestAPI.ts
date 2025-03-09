import express from 'express'
import UserFactory from '../../tests/factories/UserFactory.js'
import InquiryFactory from '../../tests/factories/InquiryFactory.js'
import ThreadManager from '../../internal/ThreadManager.js'
import Message from '../../models/Message.js'
import MessagesFactory from '../../tests/factories/MessagesFactory.js'
import Session, { ISession } from '../../models/Session.js'
import PriceManager from '../../internal/payments/PriceManager.js'
import { ETransactionType } from '../../models/Transaction.js'
import SessionsWithTransactions from '../../tests/mocks/SessionsWithTransactions.js'
import StripeManager from '../../internal/payments/StripeManager.js'
import Account, { EAccountRole } from '../../models/Account.js'
import md5 from 'md5'
import EmailClient from '../../internal/controllers/clients/EmailClient.js'
import { EmailConfig } from '../../internal/EnvironmentConfig.js'
import { IInquiry } from '../../models/Inquiry.js'
import PushNotification from '../../internal/controllers/PushNotification.js'
import { Stripe } from 'stripe'

const router = express.Router()

router.get('/environment', async (req, res) => {
  try {
    const env = process.env.NODE_ENV
    const stripe = StripeManager.getStripeClient()

    return res.status(201).json({ env })
  } catch (error) {
    console.log('/tests/create inquiry', error)
    return res.status(500).json({ exception: 'exception while creating inquiry in tests account' })
  }
})

router.post('/create-user-express', async (req, res) => {
  try {
    const { first_name, last_name, password, role } = req.body
    const user = await new Account({
      first_name,
      last_name,
      username: `${first_name}-${last_name}-${role}`,
      email: `${first_name}${last_name}@gmail.com`,
      password: md5(password),
      email_verified: true,
      role
    }).save()

    return res.status(201).json({ user })
  } catch (error) {
    console.log('/tests/create inquiry', error)
    return res.status(500).json({ exception: 'exception while creating inquiry in tests account' })
  }
})

/**
 * body {
 *   username: string, // username for tests user account
 *   artist_email: string // actual artist email
 * }
 */
router.post('/create-inquiry', async (req, res) => {
  try {
    const { username, artist_email } = req.body
    const artist = await UserFactory.getArtistByEmail(artist_email)
    const user = await UserFactory.getOrCreateByUsername(username)
    const inquiry = await InquiryFactory.createForArtist(user, artist)

    if (inquiry) {
      await PushNotification()
        .to(artist!)
        .from(user)
        .inquiry.createdForArtist()
    }

    return res.status(201).json({ artist, user, inquiry })
  } catch (error) {
    console.log('/tests/create inquiry', error)
    return res.status(500).json({ exception: 'exception while creating inquiry in tests account' })
  }
})

/**
 * Can skip inquiry process and directly create message thread
 */
router.post('/send-messages', async (req, res) => {
  try {
    const { username, artist_email, with_attachments } = req.body
    const artist = await UserFactory.getArtistByEmail(artist_email)
    const user = await UserFactory.getOrCreateByUsername(username)
    const thread = await ThreadManager.getExistingOrCreateNew({ artist: artist!, user: user! })

    const messages = []
    for (let x = 0; x < 5; x++) {
      const newMessage = await new Message({
        thread_id: thread._id,
        sender_id: user._id,
        body: MessagesFactory.generateRandomString()
      }).save()
      messages.push(newMessage)
    }

    return res.status(201).json({ artist, user, thread, messages })
  } catch (error) {
    console.log('/tests/send-messages inquiry', error)
    return res.status(500).json({ exception: 'exception while sending messages in tests account' })
  }
})

router.post('/send-email', async (req, res) => {
  try {
    const { email } = req.body
    const user = await Account.findOne({ email })
    const artist = await Account.findOne({ email: 'RileyJohnson@gmail.com' })
    const session = await Session.findOne({ artist_id: artist!._id })

    // await PushNotification().from(artist!).to(user!).session.completedByArtistForUser(session!)
    await PushNotification().from(artist!).to(user!).session.paymentMadeForArtist(ETransactionType.DEPOSIT, 228.45)

    return res.status(201).json({ success: true })
  } catch (error) {
    console.log('/tests/send-email', error)
    return res.status(500).json({ exception: 'exception while sending email in tests api' })
  }
})

router.post('/fee-structure', async (req, res) => {
  try {
    const { price, deposit } = req.body
    const session = { price, deposit } as ISession
    const depositDetails = PriceManager.depositChargeDetails(session)
    const remainderDetails = PriceManager.remainderChargeDetails(session)
    const paymentDetails = PriceManager.paymentChargeDetails(session)


    const normalizedDeposit = PriceManager.priceForTypeInCents(
      session,
      ETransactionType.DEPOSIT
    )
    const normalizedRemainder = PriceManager.priceForTypeInCents(
      session,
      ETransactionType.REMAINDER
    )
    const normalizedPayment = PriceManager.priceForTypeInCents(
      session,
      ETransactionType.PAYMENT
    )

    return res.status(200).json({
      "session with $1000 price and $200 deposit": {
        "deposit only": depositDetails,
        "payment only": paymentDetails,
        "deposit + remainder": {
          "deposit": depositDetails,
          "remainder": remainderDetails
        },
        "normalized stripe payment": {
          "deposit only": normalizedDeposit,
          "payment only": normalizedPayment,
          "deposit + payment": {
            "deposit": normalizedDeposit,
            "payment": normalizedRemainder
          }
        },
      }
    })
  } catch (error) {
    console.log('/tests/send-messages inquiry', error)
    return res.status(500).json({ exception: 'exception while sending messages in tests account' })
  }
})

router.post('/refund-transactions', async (req, res) => {
  try {
    const refundCases: any = []

    for (const item of SessionsWithTransactions) {
      const { name, session, transactions } = item
      const refundObject: any = { name }

      for (const transaction of transactions) {
        if (transaction.type === ETransactionType.DEPOSIT && session.cancelled_by_user) {
          refundObject[`${transaction.type}`] = null
        } else if (transaction.type === ETransactionType.PAYMENT && session.cancelled_by_user) {
          refundObject[`${transaction.type}`] = PriceManager.partialPaymentRefundInCents(session)

        } else {
          refundObject[`${transaction.type}`] = PriceManager.priceForTypeInCents(session, transaction.type)
        }
      }

      refundCases.push(refundObject)
    }

    return res.status(200).json({
      "session with $1000 price and $200 deposit": refundCases
    })
  } catch (error) {
    console.log('/tests/send-messages inquiry', error)
    return res.status(500).json({ exception: 'exception while sending messages in tests account' })
  }
})

router.post('/session-price-change', async (req, res) => {
  try {
    const { price, deposit, new_price } = req.body
    const session = { price, deposit, cancelled_by_user: false } as ISession

    const depositDetails = PriceManager.priceForTypeInCents(session, ETransactionType.DEPOSIT)
    const remainderDetails = PriceManager.priceForTypeInCents(session, ETransactionType.REMAINDER)

    session.price = new_price

    const depositRefund = PriceManager.priceForTypeInCents(session, ETransactionType.DEPOSIT)
    const remainderRefund = PriceManager.priceForTypeInCents(session, ETransactionType.REMAINDER)

    return res.status(200).json({
      "session details before price change": {
        "deposit": depositDetails,
        "remainder": remainderDetails,

        "refund after price change": {
          "deposit": depositRefund,
          "remainder": remainderRefund
        },
      }
    })
  } catch (error) {
    console.log('/tests/session-price-change inquiry', error)
    return res.status(500).json({ exception: 'exception while sending messages in tests account' })
  }
})

router.post('/update-user-address', async (req, res) => {
  try {
    const { user_id } = req.body
    const user = await Account.findById(user_id)
    if (user) {
      const baseAddress = {
        street: '1080 Ridley Drive',
        city: 'Burnaby',
        province_state: 'BC',
        postal_zip: 'V5A2N8',
        country: 'Canada',
        coordinates: {
          lat: 49.274227,
          lng: -122.9544974,
        }
      }
      const updatedUser = await Account.findByIdAndUpdate(
        user_id,
        { address: baseAddress },
        { new: true }
      )

      return res.status(200).json({ user: updatedUser })
    }

    return res.status(400).json({ error: 'user account not found' })
  } catch (error) {
    console.log('/tests/send-messages inquiry', error)
    return res.status(500).json({ exception: 'exception while sending messages in tests account' })
  }
})

router.post('/copy-user', async (req, res) => {
  try {
    const { user_id, location } = req.body
    const user = await Account.findById(user_id)

    if (user) {
      const name = `artist-${location}`
      const newUser = await new Account({
        email: `${name}@gmail.com`,
        username: name,
        first_name: 'mocked',
        last_name: 'artist',
        role: EAccountRole.ARTIST,
        password: user.password,
        email_verified: true,
        stripe_id: user.stripe_id,
        bio: user.bio,
        skills: user.skills
      }).save()

      return res.status(200).json(newUser)
    }

    return res.status(400).json({ error: 'user account not found' })
  } catch (error) {
    console.log('/tests/copy-user inquiry', error)
    return res.status(500).json({ exception: 'exception while copying to new user account' })
  }
})

export default router