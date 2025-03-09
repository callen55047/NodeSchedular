import { InferSchemaType, model, Schema, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

const SubSessionSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true
  }
}, { _id: false })

const SessionModel = new Schema({
  thread_id: {
    type: Types.ObjectId,
    ref: 'Thread',
    required: true
  },
  user_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  artist_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  location: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  artist_notes: {
    type: String,
    default: ''
  },
  user_notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  sub_sessions: {
    type: [SubSessionSchema],
    default: []
  },
  deposit: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  includes_tax: {
    type: Boolean,
    default: false
  },
  rejected_at: {
    type: Date,
    default: null
  },
  cancelled_at: {
    type: Date,
    default: null
  },
  cancel_reason: {
    type: String,
    default: null
  },
  cancelled_by_user: {
    type: Boolean,
    default: false
  },
  artist_completed_at: {
    type: Date,
    default: null
  },
  changes: {
    type: [{ date: Date, value: {} }],
    default: []
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
})

type ISession = IModelID & InferSchemaType<typeof SessionModel>
type ISubSession = InferSchemaType<typeof SubSessionSchema>

export {
  ISession,
  ISubSession
}

export default model<ISession>('Session', SessionModel)