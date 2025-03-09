import { Types } from 'mongoose'
import { ETransactionType } from '../../../models/Transaction'

const NotificationEvents = {
  NEW: 'NEW',
  UPDATED: 'UPDATED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'MISSED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED',
  PAYMENT: (type: ETransactionType, amount: number): string => {
    return `${type.toUpperCase()}($${amount})`
  }
}

enum ENotificationTargetType {
  THREAD = 'thread',
  MESSAGE = 'message',
  SESSION = 'session',
  INQUIRY = 'inquiry',
  ACCOUNT = 'account'
}

interface INotificationEvent {
  target: ENotificationTargetType,
  event: string,
  separator?: string,
  target_id?: Types.ObjectId,
  body?: string
}

export {
  INotificationEvent,
  NotificationEvents,
  ENotificationTargetType
}