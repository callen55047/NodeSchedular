import express from 'express'
import { getUserFromRequest } from '../../shared/RequestContext.js'
import Session from '../../../models/Session.js'
import Account from '../../../models/Account.js'
import { ITransaction } from '../../../models/Transaction.js'
import TransactionsManager from '../../../internal/payments/TransactionsManager.js'
import RefundManager from '../../../internal/payments/RefundManager.js'
import Auditor from '../../../internal/Auditor.js'
import Logger from '../../../internal/Logger.js'
import PushNotification from '../../../internal/controllers/PushNotification.js'

const router = express.Router()

router.post('/create', async (req, res) => {
  try {
    const artist = getUserFromRequest(req)
    const {
      thread_id,
      user_id,
      location,
      description,
      artist_notes,
      date,
      start_time,
      end_time,
      sub_sessions,
      deposit,
      price
    } = req.body

    const newSession = await new Session({
      thread_id,
      user_id,
      artist_id: artist._id,
      location,
      description,
      artist_notes,
      date,
      start_time,
      end_time,
      sub_sessions,
      deposit,
      price
    }).save()

    const user = await Account.findById(user_id)
    await PushNotification()
      .to(user!)
      .from(artist)
      .session
      .createdForUser(newSession)

    return res.status(201).json({ success: true, session_id: newSession._id })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while creating session' })
  }
})

router.patch('/update/:session_id', async (req, res) => {
  try {
    const session_id = req.params.session_id
    const { location, description, artist_notes, date, start_time, end_time, sub_sessions, price } = req.body
    const artist = getUserFromRequest(req)

    const updated_at = new Date()
    const changes = {
      date: updated_at,
      value: {
        date,
        start_time,
        end_time,
        sub_sessions,
        location,
        price
      }
    }
    const session = await Session.findByIdAndUpdate(session_id, {
      location,
      description,
      artist_notes,
      date,
      start_time,
      end_time,
      sub_sessions,
      updated_at,
      price,
      $push: { changes }
    }, { new: true })

    if (date || start_time || end_time || location || price || sub_sessions) {
      const user = await Account.findById(session!.user_id)
      await PushNotification()
        .from(artist)
        .to(user!)
        .session
        .changesMadeForUser(session!)
    }

    return res.status(200).json({ session })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while updating session' })
  }
})

router.patch('/complete/:session_id', async (req, res) => {
  try {
    const session_id = req.params.session_id
    const { is_cash_payment } = req.body
    const artist = getUserFromRequest(req)

    const updated_at = new Date()
    const session = await Session.findByIdAndUpdate(
      session_id,
      {
        artist_completed_at: updated_at,
        updated_at
      },
      { new: true }
    )

    const user = await Account.findById(session!.user_id)
    let transaction: ITransaction | null = null

    if (is_cash_payment) {
      transaction = await TransactionsManager.createCashPayment({
        session: session!,
        artist,
        user: user!
      })
      Auditor(session!._id).confirm().cash()
      await PushNotification()
        .to(user!)
        .from(artist)
        .receipt.cashPayment(session!)
    }

    await PushNotification()
      .to(user!)
      .from(artist)
      .session.completedByArtistForUser(session!)

    return res.status(200).json({ session, transaction })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while deleting session' })
  }
})

router.patch('/un-complete/:session_id', async (req, res) => {
  try {
    const session_id = req.params.session_id
    const artist = getUserFromRequest(req)
    const session = await Session.findByIdAndUpdate(
      session_id,
      {
        artist_completed_at: null,
        updated_at: new Date()
      },
      { new: true }
    )

    // TODO: edit logic for when adding cash payments on deposits
    await TransactionsManager.deleteCashPayment(session!)
    Auditor(session!._id).confirm().removeCash()

    const user = await Account.findById(session!.user_id)
    await PushNotification()
      .to(user!)
      .from(artist)
      .receipt.cancelledCashPayment(session!)

    return res.status(200).json({ session })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while deleting session' })
  }
})

/**
 * if user is no-show, artist will specify as cancelled_by_user,
 * and will control whether artist needs to issue refund or not.
 * Artist can cancel while session is pending acceptance at no penalty.
 */
router.patch('/cancel/:session_id', async (req, res) => {
  try {
    const session_id = req.params.session_id
    const { cancelled_by_user, reason } = req.body
    const artist = getUserFromRequest(req)
    const updated_at = new Date()
    const session = await Session.findByIdAndUpdate(
      session_id,
      {
        cancelled_at: updated_at,
        cancelled_by_user,
        cancel_reason: reason,
        updated_at
      },
      { new: true }
    )

    const user = await Account.findById(session!.user_id)
    const pnController = PushNotification().to(user!).from(artist)
    const refundedTransactions = await RefundManager.allThatApply(session!)

    if (refundedTransactions.length > 0) {
      if (cancelled_by_user) {
        await pnController.session.userNoShowForUser(session!)
      } else {
        await pnController.session.cancelledByArtistForUser(session!)
      }

      // send refund receipt to user
      for (const transaction of refundedTransactions) {
        await pnController.receipt.refund(session!, transaction)
      }
    } // if no refunded transactions, this session was never accepted

    return res.status(200).json({ session, transactions: refundedTransactions })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while deleting session' })
  }
})

export default router