import { Schema, model, InferSchemaType, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'
import AddressModel from './shared/Address.js'
import DateManager from '../internal/DateManager.js'
import cryptoRandomString from 'crypto-random-string'

enum EAccountRole {
  USER = 'user',
  ARTIST = 'artist',
  ADMIN = 'admin'
}

enum EAccountGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  UNSPECIFIED = 'unspecified'
}

const AccountModel = new Schema({
  username: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  password: {
    type: String,
    default: cryptoRandomString({ length: 16 }),
  },
  first_name: {
    type: String,
    default: '',
    trim: true
  },
  last_name: {
    type: String,
    default: '',
    trim: true
  },
  phone_number: {
    type: String,
    // verify no duplicate numbers
    // unique: true,
    default: ''
  },
  birthdate: {
    type: String,
    default: '2000-01-01'
  },
  gender: {
    type: String,
    enum: Object.values(EAccountGender),
    default: EAccountGender.UNSPECIFIED
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: Types.ObjectId,
    ref: 'Skill'
  }],
  following: {
    type: [String],
    default: []
  },
  blocked: {
    type: [String],
    default: []
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  medical_history: {
    type: String,
    default: ''
  },
  other_notes: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: Object.values(EAccountRole),
    default: EAccountRole.USER
  },
  stripe_id: {
    type: String,
    default: null
  },
  address: {
    type: AddressModel,
    default: null
  },
  profile_pic: {
    type: Types.ObjectId,
    ref: 'File'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  last_ping_at: {
    type: Date,
    default: new Date(DateManager.beginningOfTime)
  },
  deleted_at: {
    type: Date,
    default: null
  },
})

AccountModel.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'receiver_id',
  justOne: false,
  options: { sort: { created_at: -1 } }
});

AccountModel.set('toJSON', {
  virtuals: true
})

type IAccount = IModelID & InferSchemaType<typeof AccountModel>

export {
  IAccount,
  EAccountRole,
  EAccountGender
}

export default model<IAccount>('Account', AccountModel)