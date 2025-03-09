import { getUserFromRequest } from '../../shared/RequestContext.js'
import Session from '../../../models/Session.js'
import express from 'express'
import Account from '../../../models/Account.js'
import RefundManager from '../../../internal/payments/RefundManager.js'
import Logger from '../../../internal/Logger.js'
import PushNotification from '../../../internal/controllers/PushNotification.js'

const router = express.Router()

router.patch('/reject/:session_id', async (req, res) => {
  try {
    const session_id = req.params.session_id
    const { reason } = req.body
    const user = getUserFromRequest(req)

    const now = new Date()
    const session = await Session.findByIdAndUpdate(
      session_id,
      {
        rejected_at: now,
        updated_at: now,
        user_notes: reason
      },
      { new: true }
    )

    const artist = await Account.findById(session!.artist_id)
    await PushNotification()
      .to(artist!)
      .from(user)
      .session.rejectedForArtist(session!)

    return res.status(200).json({ session: session })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'exception while trying to reject booking offer' })
  }
})

router.patch('/cancel/:session_id', async (req, res) => {
  try {
    const session_id = req.params.session_id
    const { reason } = req.body
    const user = getUserFromRequest(req)
    const updated_at = new Date()
    const session = await Session.findByIdAndUpdate(
      session_id,
      {
        cancelled_at: updated_at,
        cancelled_by_user: true,
        cancel_reason: reason,
        updated_at
      },
      { new: true }
    )

    const pnController = PushNotification()
    const artist = await Account.findById(session!.artist_id)
    const refundedTransactions = await RefundManager.allThatApply(session!)

    // send user receipt for refund
    for (const transaction of refundedTransactions) {
      await pnController
        .to(user)
        .from(artist!)
        .receipt.refund(session!, transaction)
    }

    await pnController
      .to(artist!)
      .from(user)
      .session.cancelledByUserForArtist(session!)

    return res.status(200).json({ session, transactions: refundedTransactions })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while deleting session' })
  }
})

export default router