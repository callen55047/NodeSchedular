import express from 'express'
import Inquiry from '../../models/Inquiry.js'
import { getUserFromRequest } from '../shared/RequestContext.js'
import Thread from '../../models/Thread.js'
import Session from '../../models/Session.js'
import Message from '../../models/Message.js'
import Account from '../../models/Account.js'
import Transaction from '../../models/Transaction.js'
import _ from 'lodash'
import AuditRecord from '../../models/AuditRecord.js'
import Logger from '../../internal/Logger.js'
import AccountInterface from '../../models/interfaces/AccountInterface.js'
import DateManager from '../../internal/DateManager.js'

const router = express.Router()

// TODO: combine these 2 calls,
/**
 * First request will act as the data dump that returns all contacts,
 * threads, messages, inquiries, and sessions.
 * Subsequent calls will only return recent (NEW) data
 */
router.post('/artist/update', async (req, res) => {
  try {
    const timestamp = req.body.timestamp
    const minimumDate = new Date(timestamp || DateManager.beginningOfTime)
    const artist = getUserFromRequest(req)
    // can add real time update status here
    // AccountInterface.updateLastPingFor(artist)

    // need to find messages from all threads,
    // not just the ones that have been created recently
    const threads = await Thread.find({ artist_id: artist._id, archived_at: null })
    const recentThreads = threads.filter((t) => new Date(t.created_at) > minimumDate)

    const inquiries = await Inquiry.find({
      artist_id: artist._id,
      updated_at: { $gte: minimumDate }
    }).populate('attachments')

    const messages = await Message.find({
      thread_id: { $in: threads },
      updated_at: { $gte: minimumDate }
    }).populate('attachments')
    
    const sessions = await Session.find({ artist_id: artist._id })
    const recentSessions = sessions.filter((s) => new Date(s.updated_at) > minimumDate)

    // only return transactions that have been confirmed
    const transactions = await Transaction.find({
      $and: [
        {
          $or: [
            { sender_id: artist._id },
            { receiver_id: artist._id }
          ]
        },
        {
          $or: [
            { stripe_payment_success: true },
            { is_cash_payment: true }
          ]
        }
      ],
      updated_at: { $gte: minimumDate }
    })

    // payment audit trail
    const sessionIds = sessions.map((s) => s._id)
    const auditRecords = await AuditRecord.find({
      session_id: { $in: sessionIds },
      created_at: { $gte: minimumDate }
    })

    // build contact list based off of threads & inquiries
    // TODO: add user_id's from sessions (support for walk ins)
    const threadUserIds = recentThreads.map((t) => t.user_id)
    const inquiryUserIds = inquiries.map((i) => i.user_id)

    const contacts = await Account.find({
      _id: { $in: _.uniq([...threadUserIds, ...inquiryUserIds]) }
    })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    return res.status(200).json({
      timestamp,
      contacts,
      threads: recentThreads,
      messages,
      inquiries,
      sessions: recentSessions,
      transactions,
      auditRecords
    })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error during artist data fetch' })
  }
})

/**
 * User app fetch loop for data
 * first fetch should be to get all data from beginning of time
 * subsequent fetches will be only new and relevant objects
 */
router.post('/user/update', async (req, res) => {
  try {
    const timestamp = req.body.timestamp
    const minimumDate = new Date(timestamp || DateManager.beginningOfTime)
    const user = getUserFromRequest(req)
    // AccountInterface.updateLastPingFor(user)

    const threads = await Thread.find({ user_id: user._id, archived_at: null })
    const recentThreads = threads.filter((t) => new Date(t.created_at) > minimumDate)

    const inquiries = await Inquiry.find({
      user_id: user._id,
      updated_at: { $gte: minimumDate }
    }).populate('attachments')

    // need to find all messages from all threads,
    // not just the ones that have been created recently
    const messages = await Message.find({
      thread_id: { $in: threads },
      updated_at: { $gte: minimumDate }
    }).populate('attachments')

    const sessions = await Session.find({
      user_id: user._id,
      updated_at: { $gte: minimumDate }
    })

    // only return transactions that have been confirmed
    const transactions = await Transaction.find({
      $and: [
        {
          $or: [
            { sender_id: user._id },
            { receiver_id: user._id }
          ]
        },
        {
          $or: [
            { stripe_payment_success: true },
            { is_cash_payment: true }
          ]
        }
      ],
      updated_at: { $gte: minimumDate }
    })

    // payment audit trail
    const sessionIds = sessions.map((s) => s._id)
    const auditRecords = await AuditRecord.find({
      session_id: { $in: sessionIds },
      created_at: { $gte: minimumDate }
    })

    // build contact list based off of threads & inquiries
    const threadArtistIds = recentThreads.map((t) => t.artist_id)
    const inquiryArtistIds = inquiries.map((i) => i.artist_id)

    const contacts = await Account.find({
      _id: { $in: _.uniq([...threadArtistIds, ...inquiryArtistIds]) }
    })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    return res.status(200).json({
      timestamp,
      contacts,
      threads: recentThreads,
      messages,
      inquiries,
      sessions,
      transactions,
      auditRecords
    })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error during artist data fetch' })
  }
})

export default router