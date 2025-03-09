import Blacklist, { EBlacklistType } from '../models/Blacklist.js'
import DateManager from './DateManager.js'

const BlacklistManager = {

  addToken: async (token: string) => {
    await BlacklistManager.removeOldTokens()
    await new Blacklist({type: EBlacklistType.TOKEN, value: token}).save()
  },

  isTokenBlacklisted: async (token: string): Promise<boolean> => {
    const blacklistedToken = await Blacklist.findOne({ type: EBlacklistType.TOKEN, value: token })
    return !!blacklistedToken;
  },

  removeOldTokens: async () => {
    // delete tokens older than 8 days
    const expiredTimeLength = new Date(Date.now() - DateManager.sevenDays)
    const expiredTokens = await Blacklist.find({ created_at: { $lt: expiredTimeLength }})
    for (const token of expiredTokens) {
      await Blacklist.findByIdAndDelete(token._id)
    }
  }
}

export default BlacklistManager