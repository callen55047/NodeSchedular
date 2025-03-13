import { ApiContract } from '../../contracts/ApiContract'
import APIClass from './APIClass'
import { IPortalUser, ITokenAuth, IAccount } from '../../internal/models/Account'
import { IAccountUpdate } from '../../views/profile/ProfileContext'
import { IRating } from '../../internal/models/Rating'

export default class AccountAPI extends APIClass {
  private url = 'account'

  async loadPortalUser(auth: ITokenAuth): Promise<IPortalUser | null> {
    try {
      const user = await this.controller
        .dataTask<IAccount>(
          `${this.url}/profile`,
          'get',
          undefined,
          auth.access_token
        )
      return { ...user!, ...auth }
    } catch (error) {
      return null
    }
  }

  async updateProfile(props: ApiContract.Props.UpdateProfile): Promise<IAccount | null> {
    try {
      return this.controller
        .dataTask<IAccount>(
          `${this.url}/update`,
          'patch',
          { ...props }
        )
    } catch (error) {
      return null
    }
  }

  async resendEmailVerification(): Promise<ApiContract.Response.Success | null> {
    try {
      return this.controller
        .dataTask(
          `${this.url}/resend-email-verification`,
          'post'
        )
    } catch (error) {
      return null
    }
  }

  async verifyEmail(token: string): Promise<ApiContract.Response.Success | null> {
    try {
      return this.controller
        .dataTask<ApiContract.Response.Success | null>(
          `${this.url}/verify-email/${token}`,
          'post'
        )
    } catch (error) {
      console.log("api catch block")
      return null
    }
  }

  async rate(rating: IRating): Promise<IRating | null> {
    return this.controller
      .dataTask<IRating>(
        `${this.url}/rate`,
        'post',
        { ...rating }
      )
  }

  async verifyArtist(artist_id: string): Promise<ApiContract.Response.VerifyArtist | null> {
    return this.controller
      .dataTask<ApiContract.Response.VerifyArtist>(
        `${this.url}/verify-artist/${artist_id}`,
        'get'
      )
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiContract.Response.Success | null> {
    return this.controller
      .dataTask<ApiContract.Response.Success | null>(
        `${this.url}/change-password`,
        'post',
        { currentPassword, newPassword }
      )
  }
}