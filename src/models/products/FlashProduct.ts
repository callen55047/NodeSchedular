import { InferSchemaType, model, Schema, Types } from 'mongoose'
import { IModelID } from '../shared/ModelBuilders.js'

const FlashProductSchema = new Schema({
  artist_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    default: 1
  },
  height: {
    type: Number,
    default: 1
  },
  start_date: {
    type: Date,
    default: null
  },
  end_date: {
    type: Date,
    default: null
  },
  image: {
    type: Types.ObjectId,
    ref: 'File',
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

type IFlashProduct = IModelID & InferSchemaType<typeof FlashProductSchema>

export {
  IFlashProduct
}

export default model<IFlashProduct>('FlashProduct', FlashProductSchema)