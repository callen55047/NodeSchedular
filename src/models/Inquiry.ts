import { InferSchemaType, model, Schema, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'
import InquiryFieldSchema from './shared/InquiryField.js'

enum EInquiryStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
  DENIED = 'denied',
  FLAGGED = 'flagged'
}

const InquiryModel = new Schema({
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
  timeline: {
    type: String,
    default: ''
  },
  budget: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  body_location: {
    type: String,
    default: ''
  },
  working_on_existing_tattoo: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  fields: {
    type: [InquiryFieldSchema],
    default: []
  },
  flash_id: {
    type: Types.ObjectId,
    ref: 'FlashProduct',
    default: null
  },
  status: {
    type: String,
    enum: Object.values(EInquiryStatus),
    default: EInquiryStatus.PENDING
  },
  flagged_by_artist: {
    type: Boolean,
    default: false
  },
  artist_notes: {
    type: String,
    default: ''
  },
  attachments: [{
    type: Types.ObjectId,
    ref: 'File'
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

type IInquiry = IModelID & InferSchemaType<typeof InquiryModel>

export {
  IInquiry,
  EInquiryStatus
}

export default model<IInquiry>('Inquiry', InquiryModel)