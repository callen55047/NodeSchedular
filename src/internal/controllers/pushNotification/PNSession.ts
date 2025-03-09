import { ISession } from '../../../models/Session.js'
import PNControllerChild from './PNControllerChild.js'
import { ENotificationTargetType } from '../PushNotification.js'
import { ETransactionType } from '../../../models/Transaction.js'
import { NotificationEvents } from './INotificationEvent.js'

export default class PNSession extends PNControllerChild {

  async createdForUser(session: ISession): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.SESSION,
      event: NotificationEvents.NEW,
      target_id: session._id
    })
  }

  async changesMadeForUser(session: ISession): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.SESSION,
      event: NotificationEvents.UPDATED,
      target_id: session._id
    })
  }

  async completedByArtistForUser(session: ISession): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.SESSION,
      event: NotificationEvents.COMPLETED,
      target_id: session._id,
      body: 'You will be asked for final payment if you have not paid in full already.'
    })
  }

  async userNoShowForUser(session: ISession): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.SESSION,
      event: NotificationEvents.NO_SHOW,
      target_id: session._id,
      body: 'Your artist marked you as a NO SHOW for the session. ' +
        'If you did attend, please reach out to the artist immediately.'
    })
  }

  async cancelledByArtistForUser(session: ISession): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.SESSION,
      event: NotificationEvents.CANCELLED,
      target_id: session._id,
      body: 'Your artist CANCELLED your session. You will be fully refunded.'
    })
  }



  async cancelledByUserForArtist(session: ISession): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.SESSION,
      event: NotificationEvents.CANCELLED,
      target_id: session._id,
      body: `Your client CANCELLED your session. Reason: ${session.cancel_reason}`
    })
  }

  async rejectedForArtist(session: ISession): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.SESSION,
      event: NotificationEvents.REJECTED,
      target_id: session._id,
      body: `Reason: ${session.user_notes}`
    })
  }

  async paymentMadeForArtist(type: ETransactionType, amount: number): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.SESSION,
      event: NotificationEvents.PAYMENT(type, amount),
      separator: 'for'
    })
  }
}