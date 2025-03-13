import { IAccount } from '../models/Account'

const AccountStructure = {
  monthlyAccounts: (accounts: IAccount[]): IAccount[] => {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    return accounts.filter(account => {
      const lastActiveDate = new Date(account.last_ping_at)
      return lastActiveDate >= oneMonthAgo
    })
  }
}

export default AccountStructure