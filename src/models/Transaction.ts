import { Schema, model, InferSchemaType, Types } from 'mongoose'
import { IModelID } from './shared/ModelBuilders.js'

enum ETransactionType {
  DEPOSIT = 'deposit',
  REMAINDER = 'remainder',
  PAYMENT = 'payment',
  TIP = 'tip' // non-refundable
}

const TransactionModel = new Schema({
  stripe_intent_id: {
    type: String,
    default: null
  },
  stripe_refund_id: {
    type: String,
    default: null
  },
  stripe_payment_success: {
    type: Boolean,
    default: false
  },
  is_cash_payment: {
    type: Boolean,
    default: false
  },
  sender_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  receiver_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true
  },
  product_id: {
    type: Types.ObjectId,
    default: null
  },
  type: {
    type: String,
    enum: Object.values(ETransactionType),
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

type ITransaction = IModelID & InferSchemaType<typeof TransactionModel>

export {
  ITransaction,
  ETransactionType
}

export default model<ITransaction>('Transaction', TransactionModel)