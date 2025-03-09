import express from 'express'
import md5 from 'md5'
import Account, { EAccountRole } from '../../models/Account.js'
import JWTAuthentication from '../../auth/JWTAuthentication.js'
import { AuthErrors } from '../shared/RequestErrors.js'
import BlacklistManager from '../../internal/BlacklistManager.js'
import Logger from '../../internal/Logger.js'
import File, { EMetaType } from '../../models/File.js'
import { normalizeEmail } from '../../utils/StringExtensions.js'
import EventLog from '../../models/EventLog.js'
import AccountManager from '../../internal/AccountManager.js'
import MRegx from '../../internal/input/MRegx.js'
import SupportRequest from '../../external/SupportRequest.js'
import VerifTokenManager from '../../internal/VerifTokenManager.js'
import AccountInterface from '../../models/interfaces/AccountInterface.js'
import PartnerAuthLogin from '../../auth/PartnerAuthLogin.js'
import cryptoRandomString from 'crypto-random-string'
import PushNotification from '../../internal/controllers/PushNotification.js'
import accountInterface from '../../models/interfaces/AccountInterface.js'
import SmsAPI from './authAPI/SmsAPI.js'

const router = express.Router()

router.use('/sms', SmsAPI)

router.post(`/login`, async (req, res) => {
  try {
    const accountInfo = {
      email: normalizeEmail(req.body.email),
      password: md5(req.body.password)
    }

    const account = await Account.findOne({
      email: { $regex: MRegx.caseSensitive(accountInfo.email) },
      password: accountInfo.password,
      deleted_at: null
    })

    if (account != null) {
      const jwtAuth = new JWTAuthentication(account)
      const access_token = jwtAuth.generateAccessToken()
      const refresh_token = jwtAuth.generateRefreshToken()

      await AccountInterface.updateLastPingFor(account)

      return res.status(200).json({
        access_token,
        refresh_token,
        role: account.role
      })
    } else {
      return res.status(400).json({ message: 'email or password as incorrect' })
    }
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while logging in' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, is_artist } = req.body

    if (!(!!username && !!email && !!password)) {
      return res.status(400).json({ error: 'all fields must be filled out' })
    }

    const normalizedEmail = normalizeEmail(email)
    const existingEmailUser = await Account.findOne({
      email: { $regex: new RegExp('^' + normalizedEmail, 'i') }
    })
    if (existingEmailUser) {
      return res.status(400).json({ error: AuthErrors.DUPLICATE_EMAIL })
    }

    const hashedPassword = md5(password)
    const role = is_artist ? EAccountRole.ARTIST : EAccountRole.USER

    const newAccount = await new Account({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role
    }).save()

    const jwtAuth = new JWTAuthentication(newAccount)
    const access_token = jwtAuth.generateAccessToken()
    const refresh_token = jwtAuth.generateRefreshToken()

    await PushNotification().to(newAccount).auth.verifyEmail()
    await Logger(req).userRegistration(newAccount)

    return res.status(201).json({
      access_token,
      refresh_token,
      role: newAccount.role
    })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while registering account' })
  }
})

router.post('/partner-login', async (req, res) => {
  try {
    const { idToken, partner, is_artist } = req.body
    const authInfo = await PartnerAuthLogin(idToken, partner)
    const { email, username, first_name, last_name } = authInfo

    // check for existing account
    let account = await Account.findOne({
      email: { $regex: MRegx.caseSensitive(email) },
      deleted_at: null
    })

    if (!account) {
      const password = cryptoRandomString({ length: 16 })
      const role = is_artist ? EAccountRole.ARTIST : EAccountRole.USER

      account = await new Account({
        username,
        email,
        first_name,
        last_name,
        password,
        role,
        email_verified: true
      }).save()

      await Logger(req).userRegistration(account, partner)

      // TODO: send welcome email with terms of service
    }

    const jwtAuth = new JWTAuthentication(account)
    const access_token = jwtAuth.generateAccessToken()
    const refresh_token = jwtAuth.generateRefreshToken()

    return res.status(200).json({
      access_token,
      refresh_token,
      role: account.role
    })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while registering google sso' })
  }
})

router.post('/refresh-access-token', async (req, res) => {
  try {
    const refresh_token = req.body.refresh_token
    if (!refresh_token) {
      return res.status(400).json({ error: 'no refresh token provided' })
    }

    const isBlacklisted = await BlacklistManager.isTokenBlacklisted(refresh_token)
    if (isBlacklisted) {
      Logger(req).warning(`blacklisted token: ${refresh_token} attempted refresh`)
      return res.status(400).json({ error: 'refresh token has been blacklisted' })
    }

    const JWTAuth = new JWTAuthentication()
    const user = await JWTAuth.verifyRTAndGetUserAccount(refresh_token)
    if (!user) {
      return res.status(400).json({ error: 'invalid token' })
    }

    JWTAuth.withUser(user)
    const access_token = JWTAuth.generateAccessToken()
    await accountInterface.updateLastPingFor(user)

    return res.status(201).json({ access_token })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'exception while refreshing token' })
  }
})

router.get('/artist/:username', async (req, res) => {
  try {
    const username = req.params.username

    const artist = await Account
      .findOne({
        username: { $regex: new RegExp('^' + username, 'i') },
        role: EAccountRole.ARTIST,
        email_verified: true,
        stripe_id: { $ne: null },
        deleted_at: null // TODO: create global function for valid accounts
      })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    if (!artist) {
      return res.status(404).json({ error: `Could not find artist ${username}` })
    }

    const images = await File.find({ owner_id: artist._id, metaType: EMetaType.STOREFRONT })

    return res.status(200).json({ artist, images })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'unable to load user profile' })
  }
})

router.post('/logout', async (req, res) => {
  try {
    const { refresh_token } = req.body
    await BlacklistManager.addToken(refresh_token)
    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while logging out' })
  }
})

router.post('/event-log', async (req, res) => {
  try {
    const { type, message, platform, user_id } = req.body
    await new EventLog({ user_id, type, platform, message }).save()
    return res.status(201).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while creating event log' })
  }
})

router.post('/delete-account', async (req, res) => {
  try {
    const { email, password, message } = req.body
    // TODO: verify email first before deleting account

    const hashedPassword = md5(password)
    const account = await Account.findOne({ email, password: hashedPassword, deleted_at: null })
    if (!account) {
      return res.status(404).json({ error: 'account not found' })
    }

    await AccountManager().archive(account, message)

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while deleting account' })
  }
})

router.post('/support-request', async (req, res) => {
  try {
    const { email, subject, message } = req.body

    const user = await Account.findOne({
      email: { $regex: MRegx.caseSensitive(email) },
      deleted_at: null
    })
    if (!user) {
      return res.status(400).json({ error: 'NodeSchedular account not found' })
    }

    await SupportRequest.to(user).normal(subject, message)

    return res.status(201).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while sending support request to zendesk' })
  }
})

router.post('/send-reset-password-email', async (req, res) => {
  try {
    const { email } = req.body
    const user = await Account.findOne({
      email: { $regex: MRegx.caseSensitive(email) },
      deleted_at: null
    })

    if (!user) {
      return res.status(404).json({ error: "Account not found" })
    }

    await PushNotification()
      .to(user)
      .auth
      .resetPassword()

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while logging out' })
  }
})

router.patch('/try-reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const verificationToken = await VerifTokenManager.verifyTokenAndPullInstance(token)

    if (!verificationToken) {
      return res.status(400).json({ error: "Invalid token" })
    }

    const hashedPassword = md5(newPassword)
    const user = await Account.findByIdAndUpdate(
      verificationToken.user_id,
      { password: hashedPassword },
      { new: true }
    )

    await PushNotification()
      .to(user!)
      .auth
      .passwordResetComplete()

    Logger(req).info(`Forgot password and reset by user: ${user!._id}`)

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while sending email verification' })
  }
})

router.get('/featured', async (req, res) => {
  try {
    // TODO: make list of featured artist
    const accounts = await AccountInterface.activeArtists()
    const accountIds = accounts.map((a) => a._id)
    const images = await File.find({ owner_id: { $in: accountIds }, metaType: EMetaType.STOREFRONT })

    return res.status(200).json({ accounts, images })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Exception while getting featured artists' })
  }
})

export default router