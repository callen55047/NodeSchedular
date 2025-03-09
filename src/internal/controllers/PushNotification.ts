import { IAccount } from '../../models/Account.js'
import EmailClient from './clients/EmailClient.js'
import { EmailConfig } from '../EnvironmentConfig.js'
import PNSession from './pushNotification/PNSession.js'
import PNAuth from './pushNotification/PNAuth.js'
import PNReceipt from './pushNotification/PNReceipt.js'
import PNInquiry from './pushNotification/PNInquiry.js'
import PNSummary from './pushNotification/PNSummary.js'
import { trySendPushNotification } from './clients/firebaseClient.js'
import PNMessage from './pushNotification/PNMessage.js'
import TextingClient from './clients/TextingClient.js'
import { ENotificationTargetType, INotificationEvent } from './pushNotification/INotificationEvent.js'
import FullWidthEmail from './pushNotification/FullWidthEmail.js'
import HtmlComponents from './pushNotification/HtmlComponents.js'
import PlatformLinks from '../../external/PlatformLinks.js'

interface IEmailMessage {
  subject: string,
  html: string
}

interface IDeviceNotification {
  title: string,
  body: string,
  target: ENotificationTargetType,
  target_id: string
}

class PNController {
  sender: IAccount | null = null
  receiver: IAccount | null = null

  session: PNSession
  inquiry: PNInquiry
  auth: PNAuth
  receipt: PNReceipt
  summary: PNSummary
  message: PNMessage

  constructor() {
    this.session = new PNSession(this)
    this.inquiry = new PNInquiry(this)
    this.auth = new PNAuth(this)
    this.receipt = new PNReceipt(this)
    this.summary = new PNSummary(this)
    this.message = new PNMessage(this)
  }

  from(user: IAccount): PNController {
    this.sender = user
    return this
  }

  to(user: IAccount): PNController {
    this.receiver = user
    return this
  }

  async notifyEvent(event: INotificationEvent): Promise<void> {
    const prefix = `[NodeSchedular]`
    const title = `${event.event}${event.separator ? ` ${event.separator}` : ''} ${event.target}`
    const suffix = `with ${this.sender!.username}`
    const longTitle = `${prefix} - ${title} ${suffix}`
    const body = event.body || `${title} with ${this.sender!.username}.`

    const deepLinkParam = ''
    const email = {
      subject: longTitle,
      html: FullWidthEmail(
        `
          <br/>
          <br/>
          ${await HtmlComponents.senderProfilePic(this.sender!)}
          <h2>${title}</h2>
          <p>${body}</p>
          <br/>
          ${HtmlComponents.buildPlatformLink(this.receiver!, deepLinkParam)}
        `
      )
    }

    await this.sendEmail(email)

    await this.sendDeviceNotification({
      title,
      body,
      target: event.target,
      target_id: event.target_id?.toString() ?? ''
    })

    await this.sendSMS(
      `${longTitle}:
      ${body}
      
      ${PlatformLinks(this.receiver!).sms()}
      `
    )
  }

  async sendEmail(email: IEmailMessage): Promise<void> {
    return EmailClient.trySendEmail({
      to: this.receiver!.email,
      from: EmailConfig.NOTIFICATIONS.EMAIL,
      subject: email.subject,
      html: email.html
    })
  }

  async sendDeviceNotification(notification: IDeviceNotification): Promise<void> {
    return trySendPushNotification(
      notification,
      this.receiver!
    )
  }

  async sendSMS(text: string): Promise<void> {
    return TextingClient().tryUserNotification(this.receiver!, text)
  }
}

const PushNotification = () => new PNController()

export {
  IEmailMessage,
  IDeviceNotification,
  ENotificationTargetType,
  PNController
}

export default PushNotification