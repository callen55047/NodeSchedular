import { ApiContract } from '../contracts/ApiContract'
import { BEGINNING_OF_TIME } from '../internal/InputOptions'
import PortalEnvironment from '../internal/PortalEnvironment'

type SocketStatus = 'PROCESSING' | 'READY'

export default class SocketController {
  static timeoutHandle = -1
  static lastSyncTime: string = BEGINNING_OF_TIME
  static isCancelled: boolean = false
  static status: SocketStatus = 'READY'
  static hasNewData = true

  // time in ms
  static getFrequency(): number {
    if (PortalEnvironment.isProduction()) {
      return 5000
    } else {
      return 3000
    }
  }

  static hasNewSocketData(data: ApiContract.Response.SocketGroupedData | null): boolean {
    if (!data) {
      SocketController.hasNewData = false
      return false
    }

    const {
      contacts,
      threads,
      inquiries,
      messages,
      sessions,
      transactions,
      auditRecords
    } = data

    SocketController.hasNewData =
      contacts.length > 0 ||
      threads.length > 0 ||
      inquiries.length > 0 ||
      sessions.length > 0 ||
      messages.length > 0 ||
      transactions.length > 0 ||
      auditRecords.length > 0

    return SocketController.hasNewData
  }
}