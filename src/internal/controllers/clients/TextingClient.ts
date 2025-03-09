import twilio from 'twilio'
import { TwilioConfig } from '../../EnvironmentConfig.js'
import { IAccount } from '../../../models/Account.js'
import Logger from '../../Logger.js'
import NotificationSettings from '../../../models/settings/NotificationSettings.js'

const TextingClient = () => {
  const client = twilio(TwilioConfig.ACCOUNT_SID, TwilioConfig.AUTH_TOKEN)

  return {
    tryUserNotification: async (user: IAccount, text: string): Promise<void> => {
      try {
        const settings = await NotificationSettings.findOne({ owner_id: user._id })

        if (settings && settings.sms_number && settings.sms_enabled) {
          await client.messages.create({
            body: text,
            from: TwilioConfig.NUMBER,
            to: settings.sms_number
          })
        }

      } catch (error) {
        Logger().exception(`[TwilioClient] tryUserNotification: ${error}`)
        // TODO: if 3 failed attempts, remove number from settings
      }
    },

    tryDirectMessage: async (number: string, text: string): Promise<void> => {
      try {
        await client.messages.create({
          body: text,
          from: TwilioConfig.NUMBER,
          to: number
        })
      } catch (error) {
        Logger().exception(`[TwilioClient] tryDirectMessage: ${error}`)
      }
    }
  }
}

export default TextingClient