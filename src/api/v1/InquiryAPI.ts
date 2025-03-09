import express from 'express'
import { getUserFromRequest } from '../shared/RequestContext.js'
import Inquiry, { EInquiryStatus } from '../../models/Inquiry.js'
import Account from '../../models/Account.js'
import InquiryManager from '../../internal/InquiryManager.js'
import ThreadManager from '../../internal/ThreadManager.js'
import Logger from '../../internal/Logger.js'
import PushNotification from '../../internal/controllers/PushNotification.js'
import Settings from '../../models/settings/ArtistSettings.js'
import InquiryTemplate from '../../models/templates/InquiryTemplate.js'

const router = express.Router()

/**
 * Custom inquiry forms for client
 */
router.get('/for-artist/:artist_id', async (req, res) => {
  try {
    const artist_id = req.params.artist_id
    const artist = await Account.findById(artist_id)

    const settings = await Settings.findOne({ owner_id: artist!._id })
    let template, theme
    if (settings) {
      template = await InquiryTemplate.findById(settings!.custom_inquiry_id)
      theme = settings.theme
    }

    return res.status(200).json({ template, theme })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'unable to load user profile' })
  }
})

/**
 * NOTE: inquiries are only ever created from users. Artists respond to them
 * Limit of 3 images per inquiry
 */
router.post('/create', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const user_id = user._id
    const {
      artist_id,
      body_location,
      size,
      description,
      working_on_existing_tattoo,
      budget,
      timeline,
      fields,
      attachments
    } = req.body
    const artist = await Account.findById(artist_id)

    const flaggedInquiry = await InquiryManager.userHasBeenFlaggedByArtist(user_id, artist_id)
    if (flaggedInquiry) {
      Logger(req).warning(`Inquiry request blocked because artist: ${artist_id} has flagged user`)
      return res.status(400).json({ error: 'user has been flagged by artist' })
    }

    const existingInquiry = await InquiryManager.userAndArtistHaveOpenInquiry(user_id, artist_id)
    if (existingInquiry) {
      return res.status(400).json({ error: 'Inquiry already exists between artist and user' })
    }

    const newInquiry = await new Inquiry({
      user_id: user._id,
      artist_id,
      body_location,
      size,
      description,
      working_on_existing_tattoo,
      budget,
      timeline,
      fields,
      attachments
    }).save()
    await newInquiry.populate('attachments')

    await PushNotification()
      .to(artist!)
      .from(user)
      .inquiry.createdForArtist()

    return res.status(201).json(newInquiry)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while creating new inquiry' })
  }
})

/**
 * Artist will update inquiry with decision
 */
router.patch('/update/:inquiry_id', async (req, res) => {
  try {
    const inquiry_id = req.params.inquiry_id
    const { decision, artist_notes } = req.body
    const artist = getUserFromRequest(req)
    const status = InquiryManager.parseStatus(decision)

    if (status === EInquiryStatus.PENDING) {
      return res.status(400).json({ error: 'Invalid new status type' })
    }

    const updated_at = new Date()
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      inquiry_id,
      { status, artist_notes, updated_at },
      { new: true }
    )

    const user = await Account.findById(updatedInquiry!.user_id)
    const pnController = PushNotification()
    pnController.to(user!).from(artist)

    if (status === EInquiryStatus.FLAGGED || status === EInquiryStatus.DENIED) {
      await pnController.inquiry.rejectedForUser(updatedInquiry!)
      Logger(req).warning(`Marking inquiry as: ${status}, because: ${artist_notes}`)
    } else if (status === EInquiryStatus.ACCEPTED) {
      await ThreadManager.getExistingOrCreateNew({ artist, user: user! })
      await pnController.inquiry.acceptedForUser()
    }

    return res.status(200).json(updatedInquiry)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: "Internal server error while updating inquiry" })
  }
})

/**
 * User can cancel if no decision has been made
 */
router.patch('/cancel/:inquiry_id', async (req, res) => {
  try {
    const inquiry_id = req.params.inquiry_id
    if (!inquiry_id) {
      return res.status(400).json({ error: 'inquiry_id required' })
    }

    const inquiry = await Inquiry.findById(inquiry_id)
    if (inquiry!.status !== EInquiryStatus.PENDING) {
      return res.status(400).json({ error: 'Inquiry cannot be cancelled by user anymore' })
    }

    const updated_at = new Date()
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      inquiry_id,
      { status: EInquiryStatus.CANCELLED, updated_at },
      { new: true }
    )
    updatedInquiry!.populate('attachments')

    const user = getUserFromRequest(req)
    const artist = await Account.findById(updatedInquiry!.artist_id)
    await PushNotification()
      .to(artist!)
      .from(user)
      .inquiry.cancelledForArtist()

    return res.status(200).json(updatedInquiry)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: "Internal server error while cancelling inquiry" })
  }
})

export default router