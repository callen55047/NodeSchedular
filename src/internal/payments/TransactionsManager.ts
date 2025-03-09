import { ISession } from '../../models/Session.js'
import Transaction, { ETransactionType, ITransaction } from '../../models/Transaction.js'
import DateManager from '../DateManager.js'
import { IAccount } from '../../models/Account.js'

interface ICashPaymentProps {
  session: ISession,
  artist: IAccount,
  user: IAccount
}

const TransactionsManager = {

  validForSession: async (session: ISession): Promise<ITransaction[]> => {
    return Transaction.find({ product_id: session._id, stripe_payment_success: true })
  },

  getTransactionsOfTypeForSession: async (session: ISession, type: ETransactionType): Promise<ITransaction[]> => {
    return Transaction.find({ product_id: session._id, type })
  },

  findOpenIntent: async (session: ISession, type: ETransactionType): Promise<ITransaction | null> => {
    const existingTransactions = await TransactionsManager.getTransactionsOfTypeForSession(session, type)
    let openIntentTransaction: ITransaction | null = null

    for (let x = 0; x < existingTransactions.length; x++) {
      const t = existingTransactions[x]

      if (t.stripe_payment_success || t.is_cash_payment) {
        throw `${type} already confirmed for this session`
      }

      if (DateManager.isDateOlderThan(t.updated_at, DateManager.sevenDays)) {
        await Transaction.findByIdAndDelete(t._id)
      } else {
        openIntentTransaction = t
      }
    }

    return openIntentTransaction
  },

  createCashPayment: async ({ session, artist, user }: ICashPaymentProps): Promise<ITransaction> => {
    return new Transaction({
      sender_id: user!._id,
      receiver_id: artist._id,
      is_cash_payment: true,
      product_id: session!._id,
      type: ETransactionType.REMAINDER
    }).save()
  },

  deleteCashPayment: async (session: ISession) => {
    const cashPaymentTransaction = await Transaction.findOne({
      product_id: session._id,
      is_cash_payment: true,
      type: ETransactionType.REMAINDER,
      stripe_intent_id: null,
      stripe_payment_success: false
    })

    if (cashPaymentTransaction) {
      await Transaction.findByIdAndDelete(cashPaymentTransaction._id)
    }
  },

  parseType: (input: string): ETransactionType | null => {
    if (input === ETransactionType.DEPOSIT) {
      return ETransactionType.DEPOSIT
    } else if (input === ETransactionType.REMAINDER) {
      return ETransactionType.REMAINDER
    } else if (input === ETransactionType.PAYMENT) {
      return ETransactionType.PAYMENT
    }
    return null;
  },

 }

export default TransactionsManager