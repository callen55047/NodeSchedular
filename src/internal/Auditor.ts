import AuditRecord, { EAuditRecordType } from '../models/AuditRecord.js'
import { ETransactionType } from '../models/Transaction.js'
import { Types } from 'mongoose'
import { Stripe } from 'stripe'
import { IPlatformCharge } from './payments/PriceManager.js'

const createNewRecord = (
  session_id: Types.ObjectId,
  type: EAuditRecordType,
  message: string,
  charge?: number,
  app_fee?: number | null
) => {
  new AuditRecord({ session_id, type, message, charge, app_fee }).save()
}

const Auditor = (session_id: Types.ObjectId) => {
  return {
    intent: (platformCharge: IPlatformCharge) => {
      createNewRecord(
        session_id,
        EAuditRecordType.INTENT,
        'New intent created',
        platformCharge.amount,
        platformCharge.application_fee_amount
      )
    },

    confirm: (intent?: Stripe.PaymentIntent) => {
      return {
        failed: (type: ETransactionType) => {
          createNewRecord(
            session_id,
            EAuditRecordType.FAILED,
            `${type} failed to confirm intent. Status: ${intent?.status}`
          )
        },
        payment: (type: ETransactionType) => {
          createNewRecord(
            session_id,
            EAuditRecordType.CONFIRM,
            `${type} confirmed`,
            intent?.amount_received,
            intent?.application_fee_amount
          )
        },
        cash: () => {
          createNewRecord(session_id, EAuditRecordType.CASH, 'Cash final payment')
        },
        removeCash: () => {
          createNewRecord(session_id, EAuditRecordType.REMOVE_CASH, 'Removed cash final payment')
        }
      }
    },

    refund: (type: ETransactionType) => {
      return {
        success: (refund: Stripe.Refund) => {
          createNewRecord(
            session_id,
            EAuditRecordType.REFUND,
            `${type} refund complete`,
            refund.amount,
          )
        },

        failed: (error: any) => {
          createNewRecord(
            session_id,
            EAuditRecordType.FAILED,
            `${type} refund failed. error: ${error}`
          )
        }
      }
    }

  }
}

export default Auditor