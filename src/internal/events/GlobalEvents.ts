import Account, { EAccountRole, IAccount } from '../../models/Account.js'
import EventLog, { EEventLogType, EEventPlatform } from '../../models/EventLog.js'
import PushNotification, { ENotificationTargetType } from '../controllers/PushNotification.js'

const GlobalEvents = {

  artistOnboarded: async (artist: IAccount): Promise<void> => {
    const globalKey = `${artist._id}_completed_onboarding`
    const existingLog = await EventLog.findOne({ key: globalKey })
    if (existingLog) {
      return
    }

    const allUsers = await Account.find({
      role: EAccountRole.USER,
      email_verified: true,
      deleted_at: null
    })

    for (const user of allUsers) {
      await PushNotification()
        .to(user)
        .from(artist)
        .sendDeviceNotification({
          title: 'A new artist has joined NodeSchedular',
          body: `${artist.username} is live now. Check out their profile and inquire with them.`,
          target: ENotificationTargetType.ACCOUNT,
          target_id: artist.username
        })
    }

    await new EventLog({
      user_id: artist._id,
      type: EEventLogType.INFO,
      platform: EEventPlatform.SERVICES,
      key: globalKey,
      message: `Global push notification sent from artist: ${artist._id}`
    }).save()
  }
}

export default GlobalEvents