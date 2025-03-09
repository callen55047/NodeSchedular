import { InferSchemaType, model, Schema, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

enum ETrafficSource {
  PUBLIC_LINK = 'public_link',
  INSTAGRAM = 'instagram',
}

function trafficSourceFromString(str: string): ETrafficSource {
  switch (str) {
    case ETrafficSource.PUBLIC_LINK:
      return ETrafficSource.PUBLIC_LINK
    default:
      return ETrafficSource.INSTAGRAM
  }
}

const AppTrafficSchema = new Schema({
  account_id: {
    type: Types.ObjectId,
    ref: 'Account',
    default: null
  },
  source: {
    type: String,
    enum: Object.values(ETrafficSource),
    default: ETrafficSource.PUBLIC_LINK
  },
  group_name: {
    type: String,
    default: null
  },
  device_info: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

type IAppTraffic = IModelID & InferSchemaType<typeof AppTrafficSchema>

export {
  IAppTraffic,
  ETrafficSource,
  trafficSourceFromString
}

export default model<IAppTraffic>('AppTraffic', AppTrafficSchema)