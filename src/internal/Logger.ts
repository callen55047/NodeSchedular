import { Request } from 'express'
import EventLog, { EEventLogType, EEventPlatform } from '../models/EventLog.js'
import { getUserFromRequest } from '../api/shared/RequestContext.js'
import { Environment } from './EnvironmentConfig.js'
import { IAccount } from '../models/Account.js'
import AdvertisingManager from './AdvertisingManager.js'

const createLog = (type: EEventLogType, message: string, user_id?: any) => {
  if (Environment.isProduction()) {
    new EventLog({ user_id, type, platform: EEventPlatform.SERVICES, message }).save()
  } else {
    console.log(type, message)
  }
}

const Logger = (req?: Request) => {
  const user = !!req ? getUserFromRequest(req) : null

  return {
    info: (message: string) => {
      createLog(EEventLogType.INFO, message, user?._id)
    },

    debug: (message: string) => {
      console.log(EEventLogType.DEBUG, message, user?._id)
    },

    warning: (message: string) => {
      createLog(EEventLogType.WARNING, message, user?._id)
    },

    error: (message: string) => {
      createLog(EEventLogType.ERROR, message, user?._id)
    },

    exception: (error: any) => {
      createLog(
        EEventLogType.EXCEPTION,
        `${req?.originalUrl} exception: ${error}`,
        user?._id
      )
    },

    userRegistration: async (newUser: IAccount, partner?: string) => {
      const groupName = await AdvertisingManager.getLatestGroupName()
      if (groupName) {
        await new EventLog({
          user_id: newUser._id,
          type: EEventLogType.INFO,
          platform: EEventPlatform.SERVICES,
          key: groupName,
          message: `partnerLogin: ${partner}, 
            groupName: ${groupName}
            username: ${newUser.username}, 
            email: ${newUser.email},
            role: ${newUser.role}
            registered.`,
        }).save()
      }
    }
  }
}

export default Logger