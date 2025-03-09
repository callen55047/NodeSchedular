import { InferSchemaType, model, Schema, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

enum EMetaType {
  STOREFRONT = 'storefront',
  MESSAGE = 'message',
  INQUIRY = 'inquiry',
  PROFILE = 'profile',
  FLASH = 'flash',
  // internal use only. Fallback metaType
  NONE = 'none'
}

const FileModel = new Schema({
  name: {
    type: String,
    required: true
  },
  metaType: {
    type: String,
    enum: Object.values(EMetaType),
    default: EMetaType.NONE
  },
  owner_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: -1
  },
  contentType: {
    type: String,
    required: true
  },
  metadata: [{
    key: { type: String, required: true },
    value: { type: String, required: true },
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
})

type IFile = IModelID & InferSchemaType<typeof FileModel>

export {
  IFile,
  EMetaType
}

export default model<IFile>('File', FileModel)