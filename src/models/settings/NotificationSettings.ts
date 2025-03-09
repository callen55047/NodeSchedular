import { Schema, model, InferSchemaType, Types } from 'mongoose'
import { IModelID } from '../shared/ModelBuilders.js'


const NotificationSettingsModel = new Schema({
  owner_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  fcm_token: {
    type: String,
    default: null
  },
  sms_number: {
    type: String,
    default: null
  },
  sms_enabled: {
    type: Boolean,
    default: true
  },
  emails: {
    type: Boolean,
    default: true
  },
  featured_artists: {
    type: Boolean,
    default: true
  },
  followed_artist_flash: {
    type: Boolean,
    default: true
  },
  inquiry_updates: {
    type: Boolean,
    default: true
  },
  booking_updates: {
    type: Boolean,
    default: true
  },
  appointment_reminders: {
    type: Boolean,
    default: true
  },
})

type INotificationSettings = IModelID & InferSchemaType<typeof NotificationSettingsModel>

export {
  INotificationSettings
}

export default model<INotificationSettings>('NotificationSettingsView', NotificationSettingsModel)