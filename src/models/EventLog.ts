import { Schema, model, InferSchemaType, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

enum EEventLogType {
  INFO = 'info',
  DEBUG = 'debug',
  WARNING = 'warning',
  ERROR = 'error',
  EXCEPTION = 'exception'
}

enum EEventPlatform {
  SERVICES = 'services',
  ARTIST_PORTAL = 'artist portal',
  CLIENT_APP = 'client app'
}

const EventLogModel = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: 'Account',
    default: null
  },
  type: {
    type: String,
    enum: Object.values(EEventLogType),
    default: EEventLogType.INFO
  },
  platform: {
    type: String,
    enum: Object.values(EEventPlatform),
    default: EEventPlatform.SERVICES
  },
  key: {
    type: String,
    default: null
  },
  message: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

type IEventLog = IModelID & InferSchemaType<typeof EventLogModel>

export {
  IEventLog,
  EEventLogType,
  EEventPlatform
}

export default model<IEventLog>('EventLog', EventLogModel)