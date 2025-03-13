import { ApiContract } from '../../contracts/ApiContract'
import APIClass from './APIClass'
import { EAccountRole, IAccount } from '../../internal/models/Account'
import { IEventLog } from '../../internal/models/EventLog'

export default class AdminAPI extends APIClass {
  private url = 'admin'

  async getAccounts(role: EAccountRole): Promise<ApiContract.Response.accounts | null> {
    return this.controller
      .dataTask<ApiContract.Response.accounts>(
        `${this.url}/get-accounts/${role}`,
        'get',
      )
  }

  async onboardArtist(info: ApiContract.Props.RegisterUser): Promise<IAccount | null> {
    return this.controller
      .dataTask<IAccount>(
        `${this.url}/onboard-artist`,
        'post',
        info
      )
  }

  async resendOnboarding(artist_id: string): Promise<ApiContract.Response.Success | null> {
    return this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/resend-onboarding-email`,
        'post',
        { artist_id }
      )
  }

  async archiveAccount(artist_id: string): Promise<ApiContract.Response.Success | null> {
    return this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/archive-account`,
        'post',
        { artist_id }
      )
  }

  async restoreAccount(user_id: string): Promise<ApiContract.Response.Success | null> {
    return this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/restore-account`,
        'post',
        { user_id }
      )
  }

  async platformLogs(): Promise<IEventLog[] | null> {
    return this.controller
      .dataTask<IEventLog[]>(
        `${this.url}/logs/all`,
        'get'
      )
  }

  async artistDetails(artist_id: string): Promise<ApiContract.Response.ArtistDetails | null> {
    return this.controller
      .dataTask<ApiContract.Response.ArtistDetails>(
        `${this.url}/artist-details/${artist_id}`,
        'get'
      )
  }

  async setUserPassword(user_id: string, password: string): Promise<ApiContract.Response.Success | null> {
    return this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/set-new-password`,
        'post',
        { user_id, password }
      )
  }

  async pendingRequests(): Promise<ApiContract.Response.PendingRequests | null> {
    return this.controller
      .dataTask<ApiContract.Response.PendingRequests>(
        `${this.url}/pending-requests`,
        'get'
      )
  }
}