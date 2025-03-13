import APIClass from './APIClass'
import { ApiContract } from '../../contracts/ApiContract'

export default class EventAPI extends APIClass {
  private url = '/event'

  async artistOnboarded(): Promise<ApiContract.Response.Success | null> {
    return this.controller.dataTask(
      `${this.url}/artist-onboarded`,
      'post'
    )
  }
}