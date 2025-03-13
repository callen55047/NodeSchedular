import { IFile } from '../File'

interface IFlashProduct {
  _id: string,
  artist_id: string,
  title: string,
  description: string,
  quantity: number,
  price: number,
  width: number,
  height: number,
  start_date: string | null,
  end_date: string | null,
  image: IFile,
  created_at: string,
  updated_at: string,
}

export {
  IFlashProduct
}