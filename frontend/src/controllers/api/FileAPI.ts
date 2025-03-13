import APIClass from './APIClass'
import { ApiContract } from '../../contracts/ApiContract'
import { IMetadata } from '../../internal/models/Shared'
import { IFile } from '../../internal/models/File'

export default class FileAPI extends APIClass {
  private url = "file"

  async update(id: string, metadata: IMetadata[]): Promise<ApiContract.Response.Success | null> {
    try {
      return this.controller
        .dataTask<ApiContract.Response.Success>(
          `${this.url}/update/${id}`,
          "patch",
          { metadata }
        )
    } catch (error) {
      return null
    }
  }

  async getAllNonAttachments(): Promise<ApiContract.Response.FileArray | null> {
    try {
      return this.controller
        .dataTask<ApiContract.Response.FileArray>(
          `${this.url}/user/non-attachments`,
          "get"
        )
    } catch (error) {
      return null
    }
  }

  async loadAll(): Promise<ApiContract.Response.FileArray | null> {
    try {
      return await this.controller
        .dataTask<ApiContract.Response.FileArray>(
          `${this.url}/user/all`,
          "get"
        )
    } catch (error) {
      return null
    }
  }

  async upload(data: ApiContract.Props.UploadFile): Promise<ApiContract.Response.SingleFile | null> {
    try {
      return await this.controller
        .binaryDataTask<ApiContract.Response.SingleFile>(
          `${this.url}/upload/single`,
          "post",
          data
        )
    } catch (error) {
      return null
    }
  }

  async uploadAll(data: ApiContract.Props.UploadFiles): Promise<ApiContract.Response.FileArray | null> {
    try {
      return await this.controller
        .binaryDataTask<ApiContract.Response.FileArray>(
          `${this.url}/upload/many`,
          "post",
          data
        )
    } catch (error) {
      return null
    }
  }

  async delete(file_id: string): Promise<ApiContract.Response.DeleteFile | null> {
    try {
      return this.controller
        .dataTask<ApiContract.Response.DeleteFile>(
          `${this.url}/delete/${file_id}`,
          'delete'
        )
    } catch (error) {
      return null
    }
  }
}