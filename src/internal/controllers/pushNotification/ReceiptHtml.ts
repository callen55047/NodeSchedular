import { ISession } from '../../../models/Session.js'
import DateManager from '../../DateManager.js'
import PriceManager, { IPlatformChargeDetails } from '../../payments/PriceManager.js'
import { ETransactionType, ITransaction } from '../../../models/Transaction.js'

const receiptBreakdown = (
  session: ISession,
  charge: IPlatformChargeDetails,
  isRefund: boolean = false
): string => {
  const { amount } = charge
  const amountString = `${isRefund ? '-' : ''}$${amount.toFixed(2)}`
  const dateString = DateManager.normalizedDayDateString(session.date)

  return `
      <div>
      <h3>Order Details</h3>
      <div style="height: 1px; background-color: black;"> </div>
      <br />

      <div style="display: flex; justify-content: space-between">
        <p class="inline-text focused-text">Session#</p>
        <p class="inline-text">${session._id}</p>
      </div>
      <br />
      <div style="display: flex; justify-content: space-between">
        <p class="inline-text focused-text">Date</p>
        <p class="inline-text">${dateString}</p>
      </div>
      <br />
      <div style="display: flex; justify-content: space-between">
        <p class="inline-text focused-text">Time</p>
        <p class="inline-text">${session.start_time} - ${session.end_time}</p>
      </div>
      <br />
      <div style="display: flex; justify-content: space-between">
        <p class="inline-text focused-text">Price</p>
        <p class="inline-text">${amountString}</p>
      </div>
      <br />
      <br />
      
      ${isRefund ? '' : summaryOfCharges(charge)}
    </div>
    `
}

const summaryOfCharges = (charge: IPlatformChargeDetails): string => {
  const { amount, app_fee } = charge
  const { platform_cut, taxes, stripe_fee } = app_fee
  const subtotal = amount - app_fee.total
  const app_fees = platform_cut + stripe_fee

  return `
    <div style="margin-left: 200px">
        <p style="font-weight: bolder; font-size: 16px; margin-bottom: 5px;">Summary of Charges</p>
        <div style="display: flex; justify-content: space-between">
          <p class="inline-text">Subtotal</p>
          <p class="inline-text">$${subtotal.toFixed(2)}</p>
        </div>
        <div style="display: flex; justify-content: space-between">
          <p class="inline-text">Application Fees</p>
          <p class="inline-text">$${app_fees.toFixed(2)}</p>
        </div>
        <div style="display: flex; justify-content: space-between">
          <p class="inline-text">Taxes</p>
          <p class="inline-text">$${taxes.toFixed()}</p>
        </div>
        <div style="display: flex; justify-content: space-between">
          <p class="inline-text">Total</p>
          <p class="inline-text">$${amount.toFixed(2)}</p>
        </div>
        <br />
      </div>
  `
}

const ReceiptHtml = {

  buildForSession: (session: ISession, transaction: ITransaction): string => {
    let priceDetails = {} as IPlatformChargeDetails
    const isRefund = transaction.stripe_refund_id !== null

    switch (transaction.type) {
      case ETransactionType.DEPOSIT:
        priceDetails = PriceManager.depositChargeDetails(session)
        break
      case ETransactionType.REMAINDER:
        priceDetails = PriceManager.remainderChargeDetails(session)
        break
      case ETransactionType.PAYMENT:
        priceDetails = PriceManager.paymentChargeDetails(session)
        break
      case ETransactionType.TIP:
        priceDetails = {
          amount: 0,
          app_fee: { platform_cut: 0, stripe_fee: 0, taxes: 0, total: 0 }
        }
        break
    }

    return receiptBreakdown(session, priceDetails, isRefund)
  },

}

export default ReceiptHtml