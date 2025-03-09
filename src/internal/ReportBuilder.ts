import { IAccount } from '../models/Account.js'
import Transaction from '../models/Transaction.js'
import AuditRecord, { EAuditRecordType, IAuditRecord } from '../models/AuditRecord.js'

interface ICardAndCashProps {
  totalCard: number,
  totalCash: number,
  cardRecords: IAuditRecord[],
  cashRecords: IAuditRecord[],
}
const ReportBuilder = {
  cardAndCashSales: async (user: IAccount): Promise<ICardAndCashProps> => {
    const transactions = await Transaction.find({
      receiver_id: user._id,
      $or: [
        {
          stripe_intent_id: { $ne: null },
          stripe_refund_id: null,
          stripe_payment_success: true
        },
        {
          is_cash_payment: true
        }
      ]
    })

    const records = await AuditRecord.find({
      session_id: { $in: transactions.map(t => t.product_id) }
    })

    const cardRecords = records
      .filter((v) => v.type === EAuditRecordType.CONFIRM)
    const totalCard = cardRecords
      .reduce((acc, item) => acc + (item.charge ?? 0), 0)

    const cashRecords = records
      .filter((v) => v.type === EAuditRecordType.CASH)
    const totalCash = cashRecords
      .reduce((acc, item) => acc + (item.charge ?? 0), 0)

    return {
      totalCard: totalCard > 0 ? totalCard / 100 : 0,
      totalCash: totalCash > 0 ? totalCash / 100 : 0,
      cardRecords,
      cashRecords
    }
  }
}

export default ReportBuilder