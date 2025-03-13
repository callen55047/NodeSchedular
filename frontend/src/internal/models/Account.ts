import { ISkill } from './Skill'
import { IFile } from './File'
import { IRating } from './Rating'
import { IAddress } from './shared/Address'

enum EAccountRole {
  USER = 'user',
  ARTIST = 'artist',
  ADMIN = 'admin'
}

interface IAccount {
  _id: string,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  role: EAccountRole,
  birthdate: string | null,
  gender: string,
  phone_number: string,
  bio: string,
  medical_history: string,
  other_notes: string,
  stripe_id: string | null,
  ratings: IRating[],
  skills: ISkill[],
  email_verified: boolean,
  address: IAddress | null,
  profile_pic: IFile | null,
  created_at: string,
  updated_at: string,
  last_ping_at: string,
  deleted_at: string | null,
}

interface ITokenAuth {
  access_token: string,
  refresh_token: string
}

interface IPortalUser extends IAccount, ITokenAuth {
}

function calculateAge(birthdate: string | null): number {
  if (!birthdate) {
    return 0
  }

  const birthdateDate = new Date(birthdate)
  const currentDate = new Date()

  const yearsDiff = currentDate.getFullYear() - birthdateDate.getFullYear()
  const monthsDiff = currentDate.getMonth() - birthdateDate.getMonth()
  const daysDiff = currentDate.getDate() - birthdateDate.getDate()

  // Adjust for cases where the birthday hasn't occurred yet this year
  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    return yearsDiff - 1
  } else {
    return yearsDiff
  }
}

function calculateAverageRating(ratings: IRating[]): number {
  if (ratings.length === 0) {
    return 0
  }

  const totalRatings = ratings.length
  const sum = ratings.reduce((acc, rating) => {
    acc += rating.quality
    return acc
  }, 0)

  return sum / totalRatings
}

function sortByActive(list: IAccount[]): IAccount[] {
  return list.sort((a, b) => {
    if (!a.deleted_at && b.deleted_at) {
      return -1
    } else if (a.deleted_at && !b.deleted_at) {
      return 1
    } else {
      return 0
    }
  })
}

const PORTAL_USER_TYPES = [EAccountRole.ARTIST, EAccountRole.ADMIN]

export {
  IAccount,
  IPortalUser,
  ITokenAuth,
  calculateAge,
  calculateAverageRating,
  PORTAL_USER_TYPES,
  EAccountRole,
  sortByActive
}