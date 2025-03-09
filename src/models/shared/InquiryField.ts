import { InferSchemaType, Schema } from 'mongoose'

enum EInquiryFieldType {
  CHECKBOX = 'checkbox',
  SELECTION = 'selection',
  TEXT = 'text',
}

const InquiryFieldSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(EInquiryFieldType),
    default: EInquiryFieldType.CHECKBOX
  },
  field: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    default: []
  },
  value: {
    type: String,
    default: null
  }
}, { _id: false })

type IInquiryField = InferSchemaType<typeof InquiryFieldSchema>

export {
  EInquiryFieldType,
  IInquiryField
}

export default InquiryFieldSchema