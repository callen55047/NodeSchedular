import APIClass from './APIClass'
import { IInquiryTemplate } from '../../internal/models/templates/InquiryTemplate'
import { ApiContract } from '../../contracts/ApiContract'

export default class InquiryTemplateAPI extends APIClass {
  private url = 'template/inquiry'

  async all(): Promise<IInquiryTemplate[] | null> {
    return await this.controller
      .dataTask<IInquiryTemplate[]>(
        `${this.url}/all`,
        'get'
      )
  }

  async create(template: Partial<IInquiryTemplate>): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/create`,
        'post',
        { ...template }
      )
  }

  async update(template: Partial<IInquiryTemplate>): Promise<ApiContract.Response.Success | null> {
    return await this.controller
      .dataTask<ApiContract.Response.Success>(
        `${this.url}/update`,
        'patch',
        { template: { ...template } }
      )
  }
}