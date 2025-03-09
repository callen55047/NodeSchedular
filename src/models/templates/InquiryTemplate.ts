import { InferSchemaType, model, Schema, Types } from 'mongoose'
import { IModelID } from '../shared/ModelBuilders'
import InquiryFieldSchema from '../shared/InquiryField.js'

const InquiryTemplateSchema = new Schema({
  owner_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  fields: {
    type: [InquiryFieldSchema],
    default: []
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


type IInquiryTemplate = IModelID & InferSchemaType<typeof InquiryTemplateSchema>

export {

  IInquiryTemplate
}

export default model<IInquiryTemplate>('InquiryTemplate', InquiryTemplateSchema)