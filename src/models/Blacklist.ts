import { Schema, model, InferSchemaType } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

enum EBlacklistType {
  TOKEN = 'token',
  USER = 'user',
}

const BlacklistModel = new Schema({
  type: {
    type: String,
    enum: Object.values(EBlacklistType),
    required: true
  },
  value: {
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

type IBlacklist = IModelID & InferSchemaType<typeof BlacklistModel>

export {
  IBlacklist,
  EBlacklistType
}

export default model<IBlacklist>('Blacklist', BlacklistModel)