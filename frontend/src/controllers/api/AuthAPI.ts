import { ApiContract } from '../../contracts/ApiContract'
import APIClass from './APIClass'
import { ITokenAuth } from '../../internal/models/Account'
import { IEventLog } from '../../internal/models/EventLog'

export default class AuthAPI extends APIClass {
  private url = 'auth'

  async registerUser(props: ApiContract.Props.RegisterUser): Promise<ITokenAuth | null> {
    return await this.controller
      .dataTask<ITokenAuth>(
        `${this.url}/register`,
        'post',
        {
          ...props,
          is_artist: true
        }
      )
  }

  async refreshAccessToken(refresh_token?: string): Promise<ApiContract.Response.AccessTokenPayload | null> {
    if (!refresh_token) {
      return null
    }

    try {
      return await this.controller
        .dataTask<ApiContract.Response.AccessTokenPayload>(
          `${this.url}/refresh-access-token`,
          'post',
          { refresh_token }
        )
    } catch (error) {
      return null
    }
  }

  async logout(refresh_token: string): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/logout`,
        'post',
        { refresh_token }
      )
  }

  async login(props: ApiContract.Props.TryLogin): Promise<ApiContract.Response.TryLogin | null> {
    return await this.controller
      .dataTask<ApiContract.Response.TryLogin>(
        `${this.url}/login`,
        'post',
        { ...props }
      )
  }

  async publicArtistProfile(username: string): Promise<ApiContract.Response.PublicArtistProfile | null> {
    return await this.controller
      .dataTask<ApiContract.Response.PublicArtistProfile>(
        `${this.url}/artist/${username}`,
        'get'
      )
  }

  async eventLog(eventLog: IEventLog): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/event-log`,
        'post',
        { ...eventLog }
      )
  }

  async deleteAccount(props: ApiContract.Props.DeleteAccount): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/delete-account`,
        'post',
        { ...props }
      )
  }

  async supportRequest(props: ApiContract.Props.SupportRequest): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/support-request`,
        'post',
        { ...props }
      )
  }

  async passwordResetEmail(email: string): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/send-reset-password-email`,
        'post',
        { email }
      )
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/try-reset-password`,
        'patch',
        { token, newPassword }
      )
  }
}