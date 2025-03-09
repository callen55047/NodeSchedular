import PNControllerChild from './PNControllerChild.js'
import { IMessage } from '../../../models/Message.js'
import { ENotificationTargetType } from '../PushNotification.js'
import { NotificationEvents } from './INotificationEvent.js'
import { Types } from 'mongoose'

export default class PNMessage extends PNControllerChild {

  async created(message: IMessage): Promise<void> {
    return this.controller.notifyEvent({
      target: ENotificationTargetType.MESSAGE,
      event: NotificationEvents.NEW,
      target_id: message.thread_id as Types.ObjectId,
      body: message.body
    })
  }
}