import { EAccountRole, IAccount } from '../models/Account.js'

const PlatformLinks = (user: IAccount) => {
  return {

    sms: () => {
      if (user.role === EAccountRole.USER) {
        return 'Open NodeSchedular mobile to view: https://domain.com/deep-link?'
      } else {
        return 'Log into the NodeSchedular Artist Portal to view: https://domain.com/portal'
      }
    }

  }
}

export default PlatformLinks;