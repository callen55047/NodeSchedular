import APIClass from './APIClass'
import { ApiContract } from '../../contracts/ApiContract'
import INotificationSettings from '../../internal/models/settings/NotificationSettings'
import { ITokenAuth } from '../../internal/models/Account'

export default class NotificationSettingsAPI extends APIClass {
  private url = 'settings/notifications'

  async get(auth: ITokenAuth): Promise<INotificationSettings | null> {
    return this.controller
      .dataTask<INotificationSettings>(
        `${this.url}/get`,
        'get',
        undefined,
        auth.access_token
      )
      .catch((error) => {
        console.log(`error in ${this.url}/get: ${error}`)
        return null
      })
  }

  async update(settings: INotificationSettings): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/update`,
        'post',
        { settings: { ...settings } }
      )
      .catch((error) => {
        console.log(`error in ${this.url}/update: ${error}`)
        return null
      })
  }

  async testSMS(sms_number: string): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/test-sms`,
        'post',
        { sms_number }
      )
      .catch((error) => {
        console.log(`error in ${this.url}/update: ${error}`)
        return null
      })
  }
}