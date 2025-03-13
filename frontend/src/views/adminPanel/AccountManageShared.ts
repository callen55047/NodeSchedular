import { IAccount, sortByActive } from '../../internal/models/Account'
import { sortByCreatedAt } from '../../internal/ArrayUtils'

enum EUserSorting {
  JOINED = 'Joined',
  LAST_LOGIN = 'Last login',
  USERNAME = 'Username'
}

function sortList(accounts: IAccount[], sorting: string): IAccount[] {
  let list
  switch (sorting) {
    case EUserSorting.JOINED:
      list = sortByCreatedAt(accounts)
      break
    case EUserSorting.LAST_LOGIN:
      list = accounts.sort((a, b) => {
        return new Date(b.last_ping_at).getTime() - new Date(a.last_ping_at).getTime()
      })
      break
    default:
      list = accounts.sort((a, b) => a.username.localeCompare(b.username))
      break
  }
  // finally sort archived accounts to be last
  return sortByActive(list)
}

function isContainedInSearch(user: IAccount, search: string): boolean {
  if (!search) {
    return true
  }

  const normalizedSearch = search.toLowerCase()
  const normalizedUsername = user.username.toLowerCase()
  if (normalizedUsername.includes(normalizedSearch)) {
    return true
  }

  const normalizedName = `${user.first_name} ${user.last_name}`.toLowerCase()
  if (normalizedName.includes(normalizedSearch)) {
    return true
  }

  if (user._id.includes(normalizedSearch)) {
    return true
  }

  const normalizedEmail = user.email.toLowerCase()
  return normalizedEmail.includes(normalizedSearch)
}

export {
  EUserSorting,
  sortList,
  isContainedInSearch
}