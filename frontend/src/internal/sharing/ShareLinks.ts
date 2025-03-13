import { IAccount } from '../models/Account'
import { toast } from 'react-toastify'
import PortalEnvironment from '../PortalEnvironment'

const ShareLinks = {

  account: (profile: IAccount) => {
    async function _copyToClipboard(link: string) {
      await navigator.clipboard.writeText(link)
      toast.success('Link copied to clipboard!')
    }

    const deepLink = `native?artist=${profile.username}`
    const httpLink = `${PortalEnvironment.hostname()}/${deepLink}`
    const nativeLink = `domain:///${deepLink}`

    return {
      httpLink,
      nativeLink,
      copy: () => _copyToClipboard(httpLink)
    }
  },

  appstore: {
    ios: 'link-to-app-store-app',
    android: 'link-to-google-play-app',
  }

}

export default ShareLinks