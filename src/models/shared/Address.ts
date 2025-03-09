import { InferSchemaType, Schema } from 'mongoose'

const CoordinateModel = new Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  }
}, { _id: false })

const AddressModel = new Schema({
  street: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  province_state: {
    type: String,
    trim: true,
    default: ''
  },
  postal_zip: {
    type: String,
    trim: true,
    default: ''
  },
  country: {
    type: String,
    trim: true,
    default: null
  },
  coordinates: {
    type: CoordinateModel,
    default: null
  }
}, { _id: false })

type ICoordinate = InferSchemaType<typeof CoordinateModel>
type IAddress = InferSchemaType<typeof AddressModel>

export {
  ICoordinate,
  IAddress
}

export default AddressModel