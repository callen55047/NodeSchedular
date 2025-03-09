import { Schema, model, InferSchemaType, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

enum EAuditRecordType {
  INTENT = 'intent',
  CONFIRM = 'confirm',
  CASH = 'cash',
  REMOVE_CASH = 'remove_cash',
  REFUND = 'refund',
  FAILED = 'failed'
}

const AuditRecordModel = new Schema({
  session_id: {
    type: Types.ObjectId,
    ref: 'Session',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(EAuditRecordType),
    default: EAuditRecordType.INTENT
  },
  message: {
    type: String,
    required: true
  },
  charge: {
    type: Number,
    default: null
  },
  app_fee: {
    type: Number,
    default: null
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

type IAuditRecord = IModelID & InferSchemaType<typeof AuditRecordModel>

export {
  IAuditRecord,
  EAuditRecordType
}

export default model<IAuditRecord>('AuditRecord', AuditRecordModel)