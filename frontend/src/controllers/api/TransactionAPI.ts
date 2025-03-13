import APIClass from './APIClass'
import { ApiContract } from '../../contracts/ApiContract'
import { ISession } from '../../internal/models/Session'

export default class TransactionAPI extends APIClass {
  private url = 'transaction'

  async completeWithCash(session: ISession): Promise<ApiContract.Response.Transaction | null> {
    try {
      return await this.controller
        .dataTask<ApiContract.Response.Transaction>(
          `${this.url}/session/cash-payment`,
          'post',
          { session_id: session._id }
        )
    } catch (error) {
      console.log('error creating new session:', error)
      return null
    }
  }
}