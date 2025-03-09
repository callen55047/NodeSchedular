import { ISession } from '../../models/Session.js'
import { ETransactionType, ITransaction } from '../../models/Transaction.js'
import TransactionsManager from './TransactionsManager.js'
import PriceManager, { IPlatformCharge } from './PriceManager.js'
import Transaction from '../../models/Transaction.js'
import StripeManager from './StripeManager.js'
import Auditor from '../Auditor.js'
import Logger from '../Logger.js'

const RefundManager = {

  /**
   * If cancelled by user, we will only partially refund a full payment,
   * or fully refund a payment if there are both PAYMENT and DEPOSIT for session
   */
  allThatApply: async (session: ISession): Promise<ITransaction[]> => {
    const transactions = await TransactionsManager.validForSession(session)
    if (transactions.length < 1) {
      return []
    }

    const stripe = await StripeManager.getStripeClient()
    const updatedTransactions: ITransaction[] = []
    const updated_at = new Date()

    for (const transaction of transactions) {
      if (transaction.stripe_refund_id || transaction.type === ETransactionType.TIP) {
        // don't refund tips or
        // refund already issued for this transaction
        continue
      }

      if (transaction.type === ETransactionType.DEPOSIT && session.cancelled_by_user) {
        // do not refund deposits if user cancels
        continue
      }

      let refundDetails = {} as IPlatformCharge
      if (transaction.type === ETransactionType.PAYMENT && session.cancelled_by_user) {
        // don't refund whole payment is user cancels. we keep deposit
        refundDetails = PriceManager.partialPaymentRefundInCents(session)
      } else {
        refundDetails = PriceManager.priceForTypeInCents(session, transaction.type)
      }

      try {
        const refund = await stripe.refunds.create({
          payment_intent: transaction.stripe_intent_id,
          refund_application_fee: true,
          reverse_transfer: true,
          amount: refundDetails.amount
        })

        const updatedTransaction = await Transaction.findByIdAndUpdate(transaction._id, {
          stripe_refund_id: refund.id,
          updated_at
        }, { new: true })

        updatedTransactions.push(updatedTransaction!)
        Auditor(session._id).refund(transaction.type).success(refund)
      } catch (error) {
        Logger().exception(error)
        Auditor(session._id).refund(transaction.type).failed(error)
      }
    }

    return updatedTransactions
  }

}

export default RefundManager