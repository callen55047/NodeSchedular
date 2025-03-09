import { Schema, model, InferSchemaType, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

const RatingModel = new Schema({
  receiver_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  sender_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  session_id: {
    type: Types.ObjectId,
    ref: 'Session',
    default: null
  },
  quality: {
    type: Number,
    default: 0, // limit 0 - 5
    required: true
  },
  tags: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    default: ''
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

type IRating = IModelID & InferSchemaType<typeof RatingModel>

export {
  IRating
}

export default model<IRating>('Rating', RatingModel)