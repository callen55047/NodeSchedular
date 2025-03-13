import { ETransactionType, ITransaction } from '../models/Transaction'
import { ISession } from '../models/Session'

interface ISessionPayments {
  deposit?: ITransaction,
  remainder?: ITransaction,
  payment?: ITransaction
}

const TransactionStructure = {

  allForSession: (transactions: ITransaction[], session: ISession): ISessionPayments => {
    const deposit = transactions.find((t) => t.product_id === session._id && t.type === ETransactionType.DEPOSIT)
    const remainder = transactions.find((t) => t.product_id === session._id && t.type === ETransactionType.REMAINDER)
    const payment = transactions.find((t) => t.product_id === session._id && t.type === ETransactionType.PAYMENT)
    return { deposit, remainder, payment }
  },

  hasCompletedPayment: (sTransactions: ITransaction[]): boolean => {
    for (const transaction of sTransactions) {
      if ([ETransactionType.PAYMENT, ETransactionType.REMAINDER].includes(transaction.type)) {
        return true
      }
    }
    return false
  }
}

export default TransactionStructure