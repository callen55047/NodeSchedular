import ApiController from '../controllers/ApiController'
import { IAccount } from './models/Account'
import { EEventLogType, EEventPlatform, IEventLog } from './models/EventLog'
import { PORTAL_APP_VERSION } from './Versioning'
import PortalEnvironment from './PortalEnvironment'

export default class PortalLogger {
  private api: ApiController
  private user: IAccount | null

  constructor(api: ApiController, user: IAccount | null) {
    this.api = api
    this.user = user
  }

  private async createLog(type: EEventLogType, message: string): Promise<void> {
    if (PortalEnvironment.isProduction()) {
      await this.api.auth.eventLog({
        user_id: this.user?._id ?? null,
        type,
        message: `v${PORTAL_APP_VERSION} | ${message}`,
        platform: EEventPlatform.ARTIST_PORTAL
      } as IEventLog)
    } else {
      console.log(type, message)
    }
  }

  async info(message: string) {
    await this.createLog(EEventLogType.INFO, message)
  }

  async debug(message: string) {
    console.log(EEventLogType.DEBUG, message)
  }

  async warning(message: string) {
    await this.createLog(EEventLogType.WARNING, message)
  }

  async error(message: string) {
    await this.createLog(EEventLogType.ERROR, message)
  }

  async exception(message: string) {
    await this.createLog(EEventLogType.EXCEPTION, message)
  }
}