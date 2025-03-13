import APIClass from './APIClass'
import { IFlashProduct } from '../../internal/models/products/FlashProduct'
import { ApiContract } from '../../contracts/ApiContract'

export default class FlashProductAPI extends APIClass {
  private url = 'product/flash'

  async all(): Promise<IFlashProduct[] | null> {
    return await this.controller
      .dataTask<IFlashProduct[]>(
        `${this.url}/all`,
        'get'
      )
  }

  async create(product: any): Promise<IFlashProduct | null> {
    return await this.controller
      .dataTask<IFlashProduct>(
        `${this.url}/create`,
        'post',
        { ...product }
      )
  }

  async deleteFlash(flashProductId: string): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/delete/${flashProductId}`,
        'delete'
      )
  }
}