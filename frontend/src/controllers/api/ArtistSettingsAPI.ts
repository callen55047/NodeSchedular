import APIClass from './APIClass'
import { ITokenAuth } from '../../internal/models/Account'
import { IArtistSettings } from '../../internal/models/settings/ArtistSettings'
import { ApiContract } from '../../contracts/ApiContract'

export default class ArtistSettingsAPI extends APIClass {
  private url = 'settings/artist'

  async get(auth: ITokenAuth): Promise<IArtistSettings | null> {
    return this.controller
      .dataTask<IArtistSettings>(
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

  async update(settings: IArtistSettings): Promise<ApiContract.Response.Success | null> {
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
}