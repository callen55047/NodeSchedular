import express from 'express'
import { getUserFromRequest } from '../shared/RequestContext.js'
import Account, { IAccount } from '../../models/Account.js'
import Rating, { IRating } from '../../models/Rating.js'
import VerifTokenManager from '../../internal/VerifTokenManager.js'
import SMath from '../../utils/SMath.js'
import md5 from 'md5'
import Logger from '../../internal/Logger.js'
import AccountInterface from '../../models/interfaces/AccountInterface.js'
import PushNotification from '../../internal/controllers/PushNotification.js'

const router = express.Router()

router.get(`/profile`, async (req, res) => {
  try {
    const user = getUserFromRequest(req)

    return res.status(200).json(user)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while getting profile' })
  }
})

router.patch('/update', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const {
      first_name,
      last_name,
      username,
      phone_number,
      gender,
      birthdate,
      medical_history,
      other_notes,
      bio,
      stripe_id,
      address,
      profile_pic
    } = req.body

    const updatedAccount = await Account.findOneAndUpdate(
      { _id: user._id },
      {
        first_name,
        last_name,
        username,
        phone_number,
        gender,
        birthdate,
        medical_history,
        other_notes,
        bio,
        stripe_id,
        address,
        profile_pic,
        updated_at: new Date()
      },
      { new: true }
    )
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    if (!updatedAccount) {
      return res.status(404).json({ error: 'account not found' })
    }

    return res.status(200).json(updatedAccount)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while updating profile' })
  }
})

router.post('/resend-email-verification', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    await PushNotification().to(user).auth.verifyEmail()
    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while sending email verification' })
  }
})

router.post('/verify-email/:token', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const token = req.params.token

    const verificationToken = await VerifTokenManager.verifyTokenAndPullInstance(token)

    if (!verificationToken) {
      return res.status(404).json({ error: 'Token has expired or cannot be found' })
    }

    await Account.findByIdAndUpdate(user._id, { email_verified: true, updated_at: new Date() })
    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while verifying email token' })
  }
})

router.patch('/follow/:artist_id', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const artist_id = req.params.artist_id
    const followed = user.following.includes(artist_id)

    let updatedProfile: IAccount | null

    if (followed) {
      updatedProfile = await Account.findByIdAndUpdate(
        user._id,
        { $pull: { following: artist_id } },
        { new: true }
      )
    } else {
      updatedProfile = await Account.findByIdAndUpdate(
        user._id,
        { $push: { following: artist_id } },
        { new: true }
      )
    }

    return res.status(200).json({ following: updatedProfile?.following })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while trying to follow profile' })
  }
})

router.get('/following/all', async (req, res) => {
  try {
    const user = getUserFromRequest(req)

    const following = await Account
      .find({
        deleted_at: null,
        $and:
          [
            { _id: { $in: user.following } },
            { _id: { $nin: user.blocked } }
          ]
      })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    return res.status(200).json({ following })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while trying to follow profile' })
  }
})

router.patch('/block-user/:user_id', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const blockedUserId = req.params.user_id
    const isBlocked = user.blocked.includes(blockedUserId)

    const queryParams = isBlocked ?
      { $pull: { blocked: blockedUserId } } :
      { $push: { blocked: blockedUserId } }

    const updatedProfile = await Account.findByIdAndUpdate(user._id, queryParams, { new: true })

    if (!isBlocked) {
      Logger(req).warning(`Blocking user: ${blockedUserId}`)
    } else {
      Logger(req).info(`Unblocking user: ${blockedUserId}`)
    }

    return res.status(200).json({ blocked: updatedProfile?.blocked })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while trying to follow profile' })
  }
})

router.get('/blocked-users/all', async (req, res) => {
  try {
    const user = getUserFromRequest(req)

    const blockedUsers = await Account
      .find({ _id: { $in: user.blocked } })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    return res.status(200).json({ blocked: blockedUsers })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while trying to follow profile' })
  }
})

router.get('/verify-artist/:artist_id', async (req, res) => {
  try {
    const artist_id = req.params.artist_id
    const artist = await Account.findById(artist_id)
    const verifiedDetails = await AccountInterface.verifyArtist(artist!)

    return res.status(200).json(verifiedDetails)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'exception while verifying artist' })
  }
})

router.get('/get-rating', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const aggregateResult = await Rating.aggregate([
      { $match: { receiver_id: user._id } },
      {
        $group: {
          _id: null,
          quality: { $avg: '$quality' }
        }
      }
    ])
    const average = aggregateResult.length > 0 ? aggregateResult[0] : {}
    const ratings = await Rating.find({ receiver_id: user._id })
    return res.status(200).json({ ratings, average })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'exception while getting user rating' })
  }
})

router.post('/rate', async (req, res) => {
  try {
    const sender = getUserFromRequest(req)
    const {
      receiver_id,
      session_id,
      quality,
      tags,
      comment
    } = req.body

    const ratings = {
      quality: SMath.clamp((quality || 0), 0, 5), // clamp values between 0 and 5
      tags,
      comment
    }

    let rating: IRating | null
    const existingRating = await Rating.findOne({ sender_id: sender._id, receiver_id, session_id })
    if (existingRating) {
      rating = await Rating.findByIdAndUpdate(existingRating._id, {
        ...ratings,
        updated_at: new Date(),
      }, { new: true })
    } else {
      rating = await new Rating({
        sender_id: sender._id,
        receiver_id,
        session_id,
        ...ratings
      }).save()
    }

    return res.status(200).json(rating)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while rating user' })
  }
})

router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const requestUser = getUserFromRequest(req)
    const user = await Account.findById(requestUser._id)

    const currentPH = md5(currentPassword)
    if (currentPH !== user!.password) {
      return res.status(400).json({ error: 'Current password is incorrect!' })
    }

    const newPH = md5(newPassword)
    await Account.findByIdAndUpdate(user!._id, { password: newPH })
    Logger(req).info("Password changed")

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while changing password' })
  }
})

export default router