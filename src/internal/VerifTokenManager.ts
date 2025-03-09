import { IAccount } from '../models/Account.js'
import cryptoRandomString from 'crypto-random-string'
import VerificationToken, { IVerificationToken } from '../models/tokens/VerificationToken.js'
import Logger from './Logger.js'

const VerifTokenManager = {

  deleteExpiredTokens: async () => {
    const now = new Date()
    const result = await VerificationToken.deleteMany({ expires: { $lt: now }})
    Logger().info(`Deleted ${result.deletedCount} expired VerificationTokens`)
  },

  generateNewUserToken: async (user: IAccount, length: number = 4): Promise<string> => {
    const verificationToken = await new VerificationToken({
      token: cryptoRandomString({ length, type: 'numeric' }),
      user_id: user._id,
    }).save()

    return verificationToken.token
  },

  /**
   * Gets token if found, deletes from database and returns
   * @param token
   */
  verifyTokenAndPullInstance: async (token?: string): Promise<IVerificationToken | null> => {
    await VerifTokenManager.deleteExpiredTokens()

    const verifToken = await VerificationToken.findOne({ token })
    if (verifToken) {
      await VerificationToken.findByIdAndDelete(verifToken._id)
    }

    return verifToken
  }

}

export default VerifTokenManager