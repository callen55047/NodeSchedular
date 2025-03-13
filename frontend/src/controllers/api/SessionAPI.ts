import APIClass from './APIClass'
import { ApiContract } from '../../contracts/ApiContract'
import { ISession } from '../../internal/models/Session'

export default class SessionAPI extends APIClass {
  private url = 'session'

  async create(session: ISession): Promise<ApiContract.Response.SessionCreated | null> {
    try {
      return await this.controller
        .dataTask<ApiContract.Response.SessionCreated>(
          `${this.url}/artist/create`,
          'post',
          { ...session }
        )
    } catch (error) {
      console.log('error creating new session:', error)
      return null
    }
  }

  async update(session: Partial<ISession>): Promise<ApiContract.Response.Session | null> {
    try {
      return await this.controller
        .dataTask<ApiContract.Response.Session>(
          `${this.url}/artist/update/${session._id}`,
          'patch',
          { ...session }
        )
    } catch (error) {
      console.log('error updating session:', error)
      return null
    }
  }

  async complete(session: ISession, is_cash_payment: boolean): Promise<ApiContract.Response.CompleteSession | null> {
    try {
      return await this.controller
        .dataTask<ApiContract.Response.CompleteSession>(
          `${this.url}/artist/complete/${session._id}`,
          'patch',
          {
            is_cash_payment
          }
        )
    } catch (error) {
      console.log('error updating session:', error)
      return null
    }
  }

  async unComplete(session: ISession): Promise<ApiContract.Response.Session | null> {
    try {
      return await this.controller
        .dataTask<ApiContract.Response.Session>(
          `${this.url}/artist/un-complete/${session._id}`,
          'patch'
        )
    } catch (error) {
      console.log('error updating session:', error)
      return null
    }
  }

  async cancel(session: ISession, cancelled_by_user: boolean, reason: string):
    Promise<ApiContract.Response.SessionCancelled | null> {
    try {
      return await this.controller
        .dataTask<ApiContract.Response.SessionCancelled>(
          `${this.url}/artist/cancel/${session._id}`,
          'patch',
          { cancelled_by_user, reason }
        )
    } catch (error) {
      console.log('error updating session:', error)
      return null
    }
  }
}