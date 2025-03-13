import { createContext } from 'react'
import { IFile } from '../../internal/models/File'
import { IAddress } from '../../internal/models/shared/Address'

interface IAccountUpdate {
  first_name?: string,
  last_name?: string,
  birthdate?: string,
  gender?: string,
  phone_number?: string,
  address?: IAddress,
  bio?: string,
  profile_pic?: IFile
}

interface IConfigContext {
  isInEditMode: boolean,
  profile: IAccountUpdate,
  updateProfile: (values: IAccountUpdate) => void,
  handleEditSave: () => void,
  handleCancel: () => void
}

const ProfileContext = createContext({} as IConfigContext)

export {
  ProfileContext,
  IAccountUpdate
}
