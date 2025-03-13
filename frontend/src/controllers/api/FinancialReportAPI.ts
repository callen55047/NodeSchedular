import APIClass from './APIClass'
import { ApiContract } from '../../contracts/ApiContract'

export default class FinancialReportAPI extends APIClass {
  private url = '/report/financial'

  async sales(): Promise<ApiContract.Response.FinancialSales | null> {
    return await this.controller
      .dataTask<ApiContract.Response.FinancialSales>(
        `${this.url}/sales`,
        'get'
      )
  }
}