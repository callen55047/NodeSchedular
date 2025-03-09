import { InferSchemaType, model, Schema, Types } from 'mongoose'
import { IModelID } from '../shared/ModelBuilders.js'

const VerificationTokenModel = new Schema({
  token: {
    type: String,
    required: true
  },
  user_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  expires: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
  }
})

type IVerificationToken = IModelID & InferSchemaType<typeof VerificationTokenModel>

export {
  IVerificationToken
}

export default model<IVerificationToken>('VerificationToken', VerificationTokenModel)