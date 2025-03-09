import PNControllerChild from './PNControllerChild.js'
import HtmlComponents from './HtmlComponents.js'
import FullWidthEmail from './FullWidthEmail.js'
import { IInquiry } from '../../../models/Inquiry'
import { IMessage } from '../../../models/Message'

export default class PNSummary extends PNControllerChild {

  async dailyUnread(inquiries: IInquiry[], messages: IMessage[]): Promise<void> {
    const email = {
      subject: `[NodeSchedular] - Daily Summary`,
      html: FullWidthEmail(
        HtmlComponents.dailySummaryHeading(),
        HtmlComponents.dailySummaryBody(inquiries.length, messages.length),
      )
    }
    return this.controller.sendEmail(email)
  }

  async artistUnreadForAdmin(inquiries: IInquiry[], messages: IMessage[]): Promise<void> {
    const email = {
      subject: `[Artist: ${this.controller.sender!.username}] - Daily Unread`,
      html: FullWidthEmail(
        HtmlComponents.dailySummaryHeading(),
        `
          ${await HtmlComponents.userProfileRow(this.controller.sender!)}
          <br>
          ${HtmlComponents.dailySummaryBody(inquiries.length, messages.length)}
        `
      )
    }
    return this.controller.sendEmail(email)
  }

}