import firebase from 'firebase-admin'
import { IDeviceNotification } from '../PushNotification.js'
import NotificationSettings from '../../../models/settings/NotificationSettings.js'
import Logger from '../../Logger.js'
import { serviceAccount } from './firebase/firebaseConfig.js'
import { IAccount } from '../../../models/Account.js'

// initialize when you have credentials ready
// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount)
// })

const trySendPushNotification = async (notification: IDeviceNotification, user: IAccount) => {
  try {
    const settings = await NotificationSettings.findOne({ owner_id: user._id })

    if (settings && settings.fcm_token) {
      const message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        token: settings.fcm_token,
        data: {
          type: notification.target,
          target: notification.target_id
        }
      }

      await firebase.messaging().send(message)
    }
  } catch (error) {
    Logger().exception(`[firebaseClient] ${error}`)
    // TODO clear if error is equal to 'identity not found'
  }
}

export {
  trySendPushNotification
}