import { Schema, model, InferSchemaType, Types } from 'mongoose'
import { IModelID } from '../shared/ModelBuilders.js'
import CustomTheme from './CustomTheme.js'
import AddressModel from '../shared/Address.js'

enum ETimeSlotIncrements {
  HOUR = 'hour',
  HALF = 'half',
  QUARTER = 'quarter'
}

const ArtistSettingsSchema = new Schema({
  owner_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  portal_start_page: {
    type: String,
    default: 'dashboard'
  },
  custom_studio_address: {
    type: AddressModel,
    default: null
  },
  default_booking_length: {
    type: Number,
    default: 2
  },
  time_slot_increments: {
    type: String,
    enum: Object.values(ETimeSlotIncrements),
    default: ETimeSlotIncrements.HOUR
  },
  recurring_days_off: {
    type: [String],
    default: ['saturday', 'sunday']
  },
  daily_work_hours: {
    type: {
      start_time: String,
      end_time: String
    },
    default: {
      start_time: '09:00',
      end_time: '17:00'
    }
  },
  session_buffer_time: {
    type: {
      enabled: Boolean,
      before: Number,
      after: Number
    },
    default: {
      enabled: false,
      before: 0,
      after: 30
    }
  },
  default_deposit: {
    type: Number,
    default: 40
  },
  default_price: {
    type: Number,
    default: 200
  },
  default_price_includes_tax: {
    type: Boolean,
    default: false
  },
  custom_inquiry_id: {
    type: Types.ObjectId,
    ref: 'InquiryTemplate',
    default: null
  },
  theme: {
    type: CustomTheme,
    default: null
  }
})

type IArtistSettings = IModelID & InferSchemaType<typeof ArtistSettingsSchema>

export {
  IArtistSettings
}

export default model<IArtistSettings>('ArtistSettings', ArtistSettingsSchema)