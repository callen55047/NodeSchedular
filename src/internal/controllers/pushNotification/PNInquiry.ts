import PNControllerChild from './PNControllerChild.js'
import { IInquiry } from '../../../models/Inquiry.js'
import { ENotificationTargetType } from '../PushNotification.js'
import { NotificationEvents } from './INotificationEvent.js'

export default class PNInquiry extends PNControllerChild {

  async createdForArtist(): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.INQUIRY,
      event: NotificationEvents.NEW,
      body: 'Review the inquiry details and let the client know As soon as possible.'
    })
  }

  async cancelledForArtist(): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.INQUIRY,
      event: NotificationEvents.CANCELLED
    })
  }

  async acceptedForUser(): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.INQUIRY,
      event: NotificationEvents.ACCEPTED,
      body: 'You can now directly message with the artist and setup a booking time.'
    })
  }

  async rejectedForUser(inquiry: IInquiry): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.INQUIRY,
      event: NotificationEvents.REJECTED,
      body: `Reason: ${inquiry.artist_notes}`
    })
  }
}