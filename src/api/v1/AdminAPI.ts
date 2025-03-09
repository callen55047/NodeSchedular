import express from 'express'
import Account, { EAccountRole } from '../../models/Account.js'
import cryptoRandomString from 'crypto-random-string'
import md5 from 'md5'
import Logger from '../../internal/Logger.js'
import AccountManager from '../../internal/AccountManager.js'
import { getUserFromRequest } from '../shared/RequestContext.js'
import EventLog from '../../models/EventLog.js'
import { isValid, normalizeEmail } from '../../utils/StringExtensions.js'
import File, { EMetaType } from '../../models/File.js'
import Inquiry, { EInquiryStatus } from '../../models/Inquiry.js'
import Session, { ISession } from '../../models/Session.js'
import _ from 'lodash'
import AccountInterface from '../../models/interfaces/AccountInterface.js'
import AuditRecord from '../../models/AuditRecord.js'
import PushNotification from '../../internal/controllers/PushNotification.js'
import Thread from '../../models/Thread.js'
import Message from '../../models/Message.js'
import Transaction from '../../models/Transaction.js'
import { ObjectId } from 'mongoose'

const router = express.Router()

router.get('/get-accounts/:role', async (req, res) => {
  try {
    const accounts = await Account
      .find({ role: req.params.role })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    return res.status(200).json({ accounts })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while getting artists' })
  }
})

router.post('/onboard-artist', async (req, res) => {
  try {
    const { email, username, password } = req.body

    const normalizedEmail = normalizeEmail(email)
    const existingEmailUser = await Account.findOne({
      email: { $regex: new RegExp('^' + normalizedEmail, 'i') }
    })
    if (existingEmailUser) {
      return res.status(400).json({ error: 'Email is in use' })
    }


    const userPassword = isValid(password) ? password : cryptoRandomString({ length: 10 })
    const hashedPassword = md5(userPassword)

    const newAccount = await new Account({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role: EAccountRole.ARTIST,
      email_verified: true
    }).save()

    await PushNotification().to(newAccount).auth.onboardArtist(userPassword)

    return res.status(200).json(newAccount)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while onboarding new artist' })
  }
})

router.post('/resend-onboarding-email', async (req, res) => {
  try {
    const { artist_id } = req.body

    const artist = await Account.findById(artist_id)
    if (!artist) {
      return res.status(404).json({ error: 'Artist_id not found' })
    }

    const password = cryptoRandomString({ length: 10 })
    const hashedPassword = md5(password)

    await Account.findByIdAndUpdate(artist._id, {
      password: hashedPassword,
      email_verified: true
    })

    await PushNotification().to(artist).auth.onboardArtist(password)

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while onboarding new artist' })
  }
})

router.post('/archive-account', async (req, res) => {
  try {
    const { artist_id } = req.body
    const user = getUserFromRequest(req)

    const artist = await Account.findById(artist_id)
    if (!artist) {
      return res.status(400).json({ error: 'Artist_id not found' })
    }

    // can send email to account holder after archiving
    await AccountManager(user).archive(artist, 'Archiving from admin panel')

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while archiving artist' })
  }
})

router.get('/logs/all', async (req, res) => {
  try {
    const logs = await EventLog.find()

    return res.status(200).json(logs)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while archiving account' })
  }
})

router.post('/restore-account', async (req, res) => {
  try {
    const { user_id } = req.body
    const user = getUserFromRequest(req)

    const updatedAccount = await Account.findByIdAndUpdate(user_id, { deleted_at: null }, { new: true })
    Logger(req).info(`Restoring account ${updatedAccount!._id}, initiated by ${user._id}`)

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while restoring account' })
  }
})

router.get('/artist-details/:artist_id', async (req, res) => {
  try {
    const artist_id = req.params.artist_id
    const artist = await Account
      .findById(artist_id)
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    const storeFrontImages = await File.find({ owner_id: artist!._id, metaType: EMetaType.STOREFRONT })
    const payments = await AccountInterface.hasChargesEnabled(artist!)

    const inquiries = await Inquiry.find({ artist_id: artist!._id })
    const sessions = await Session.find({ artist_id: artist!._id })

    const inquiryUserIds = inquiries.map((i) => i.user_id)
    const sessionUserIds = sessions.map((s) => s.user_id)
    const sessionIds = sessions.map((s) => s._id)

    const auditRecords = await AuditRecord.find({ session_id: { $in: sessionIds } })
    const transactions = await Transaction.find({
      $and: [
        {
          $or: [
            { sender_id: artist!._id },
            { receiver_id: artist!._id }
          ]
        },
        {
          $or: [
            { stripe_payment_success: true },
            { is_cash_payment: true }
          ]
        }
      ]
    })

    const threads = await Thread.find({ artist_id: artist!._id })
    const messages = await Message.find({ thread_id: { $in: threads } })
      .populate('attachments')

    const contacts = await Account.find({
      _id: { $in: _.uniq([...sessionUserIds, ...inquiryUserIds]) }
    })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    const followers = await Account.countDocuments({
      following: artist!._id,
      deleted_at: null
    })

    return res.status(200).json({
      artist,
      storeFrontImages,
      payments,
      inquiries,
      sessions,
      transactions,
      threads,
      messages,
      contacts,
      auditRecords,
      followers
    })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while getting artist details' })
  }
})

router.post('/set-new-password', async (req, res) => {
  try {
    const { user_id, password } = req.body
    const hashedPassword = md5(password)

    await Account.findByIdAndUpdate(user_id, { password: hashedPassword })

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while setting new password for user' })
  }
})

router.get('/pending-requests', async (req, res) => {
  try {
    const activeIds = (await AccountInterface.activeArtists()).map(a => a._id)
    const pendingInquiries = await Inquiry
      .find({
        status: EInquiryStatus.PENDING,
        artist_id: { $in: activeIds }
      })
      .populate('attachments')

    const pendingSessions = await Session.aggregate([
      {
        $lookup: {
          from: 'Transaction',
          localField: '_id',
          foreignField: 'product_id',
          as: 'transactions'
        }
      },
      {
        $match: {
          transactions: { $size: 0 }
        }
      },
      {
        $match: {
          artist_id: { $in: activeIds }
        }
      }
    ]) as ISession[]

    const accountIds = [
      ...pendingInquiries.flatMap(i => [i.artist_id, i.user_id]),
      ...pendingSessions.flatMap(s => [s.artist_id, s.user_id])
    ]
    const uniqueIds = Array.from(new Set(accountIds)) as ObjectId[]
    const accounts = await AccountInterface.load(uniqueIds)

    return res.status(200).json({ pendingInquiries, pendingSessions, accounts })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while setting new password for user' })
  }
})

export default router