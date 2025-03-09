import Account, { EAccountRole } from '../../../models/Account.js'
import JWTAuthentication from '../../../auth/JWTAuthentication.js'
import AccountInterface from '../../../models/interfaces/AccountInterface.js'
import LocalizedText from '../../../localized/LocalizedText.js'
import SafeRouter from '../../../middleware/SafeRouter.js'
import Logger from '../../../internal/Logger.js'
import TextingClient from '../../../internal/controllers/clients/TextingClient.js'
import VerifTokenManager from '../../../internal/VerifTokenManager.js'

SafeRouter.POST('/begin', async (req, res) => {
  const { phone_number, is_artist } = req.body

  const phoneNumberRegex = /^[0-9]{10,12}$/
  if (!phoneNumberRegex.test(phone_number)) {
    return res.status(400).send({ message: 'Invalid phone number' })
  }

  const role = is_artist ? EAccountRole.ARTIST : EAccountRole.USER
  let account = await Account.findOne({ phone_number, role })

  if (!account) {
    account = await new Account({ phone_number, role }).save()
  }

  const token = await VerifTokenManager.generateNewUserToken(account)

  await TextingClient().tryDirectMessage(
    phone_number,
    LocalizedText.smsVerifyCode(token)
  )
  Logger(req).info(`account_id: ${account!._id} | SMS token sent | ${token}`)

  return res.status(200).send({ account_id: account!._id })
})

SafeRouter.POST('/verify', async (req, res) => {
  const { account_id, code } = req.body
  const account = await Account.findById(account_id)

  if (!account) {
    return res.status(400).send({ message: 'Account not found' })
  }

  const token = await VerifTokenManager.verifyTokenAndPullInstance(code)

  if (!token) {
    Logger(req).info(`account_id: ${account_id} | SMS token invalid | ${code}`)
    return res.status(400).send({ message: 'Invalid code' })
  }

  Logger(req).info(`account_id: ${account_id} | SMS token verified | ${code}`)

  const jwtAuth = new JWTAuthentication(account)
  const access_token = jwtAuth.generateAccessToken()
  const refresh_token = jwtAuth.generateRefreshToken()

  await AccountInterface.updateLastPingFor(account)

  return res.status(200).json({
    access_token,
    refresh_token,
    role: account.role
  })
})

export default SafeRouter.router