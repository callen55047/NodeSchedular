import { IMetadata } from './Shared'

enum EMetaType {
  STOREFRONT = 'storefront',
  MESSAGE = 'message',
  INQUIRY = 'inquiry',
  PROFILE = 'profile',
  FLASH = 'flash'
}

interface IFile {
  _id: string,
  name: string,
  metaType: string,
  owner_id: string,
  size: number,
  contentType: string,
  url: string,
  metadata: IMetadata[],
  created_at: string,
  updated_at: string

  // local properties
  local_file?: File
}

const SUPPORTED_FILE_TYPES = 'image/png, image/jpeg, image/jpg'
const LOCAL_FILE_ID = 'local_file_id'

export {
  EMetaType,
  IFile,
  SUPPORTED_FILE_TYPES,
  LOCAL_FILE_ID
}