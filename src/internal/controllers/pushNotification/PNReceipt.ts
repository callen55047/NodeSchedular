import PNControllerChild from './PNControllerChild.js'
import FixedWidthEmail from './FixedWidthEmail.js'
import { ISession } from '../../../models/Session.js'
import { ITransaction } from '../../../models/Transaction.js'
import ReceiptHtml from './ReceiptHtml.js'
import DateManager from '../../DateManager.js'

export default class PNReceipt extends PNControllerChild {

  async session(session: ISession, transaction: ITransaction): Promise<void> {
    const email = {
      subject: `[NodeSchedular] - Your NodeSchedular Receipt`,
      html: FixedWidthEmail(
        "Your Receipt",
        "Thank you for using NodeSchedular Software to book your appointment. Your e-receipt is below.",
        ReceiptHtml.buildForSession(session, transaction)
      )
    }
    return this.controller.sendEmail(email)
  }

  async refund(session: ISession, transaction: ITransaction): Promise<void> {
    const email = {
      subject: `[NodeSchedular] - Your NodeSchedular Refund`,
      html: FixedWidthEmail(
        "Your Refund",
        "We're sorry about the inconvenience. We've refunded your payment method.",
        ReceiptHtml.buildForSession(session, transaction)
      )
    }
    return this.controller.sendEmail(email)
  }

  async cashPayment(session: ISession): Promise<void> {
    const dateString = DateManager.normalizedDayDateString(session.date)
    const email = {
      subject: `[NodeSchedular] - Your NodeSchedular Receipt`,
      html: FixedWidthEmail(
        "Your Receipt",
        `You paid for the remainder of your session on ${dateString} in cash. You're good to go!`,
        `<div><br /></div>`
      )
    }
    return this.controller.sendEmail(email)
  }

  async cancelledCashPayment(session: ISession): Promise<void> {
    const dateString = DateManager.normalizedDayDateString(session.date)
    const email = {
      subject: `[NodeSchedular] - Cash Payment Cancelled`,
      html: FixedWidthEmail(
        "Cash Payment Cancelled",
        `Your artist cancelled your cash payment for your session on ${dateString}.`,
        `<div><br /></div>`
      )
    }
    return this.controller.sendEmail(email)
  }

}