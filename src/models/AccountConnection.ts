import { InferSchemaType, model, Schema, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

enum EConnectionSource {
  SHOP = 'shop',
  REFERRAL = 'referral',
}

const AccountConnectionSchema = new Schema({
  to: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  from: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(EConnectionSource),
    default: EConnectionSource.SHOP
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

type IAccountConnection = IModelID & InferSchemaType<typeof AccountConnectionSchema>

export {
  IAccountConnection,
  EConnectionSource
}

export default model<IAccountConnection>('AccountConnection', AccountConnectionSchema)