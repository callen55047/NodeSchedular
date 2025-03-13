import APIClass from './APIClass'
import { ApiContract } from '../../contracts/ApiContract'
import { IAppTraffic } from '../../internal/models/AppTraffic'

export default class AuthAPI extends APIClass {
  private url = 'traffic'

  async add(
    source: string,
    device_info: string,
    group_name: string | null,
    account_id?: string
  ): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/add`,
        'post',
        {
          source,
          account_id,
          group_name,
          device_info
        }
      )
  }

  async all(): Promise<IAppTraffic[] | null> {
    return await this.controller
      .dataTask<IAppTraffic[]>(
        `${this.url}/all`,
        'get'
      )
  }
}