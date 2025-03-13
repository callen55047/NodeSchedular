import { IAccount } from '../models/Account'
import ApiController from '../../controllers/ApiController'
import BrowserTypes from './BrowserTypes'
import UrlParams from './UrlParams'

const RegisterAppTraffic = async (artist?: IAccount) => {
  if (BrowserTypes.shouldIgnore()) {
    return
  }

  const api = new ApiController(null)
  const userAgent = `[UserAgent] ${navigator.userAgent}`
  const isEmbedded = navigator.userAgent.includes(BrowserTypes.Embedded.instagram)
  const source = isEmbedded ? 'instagram' : 'public_link'
  const groupName = UrlParams().groupName

  await api.appTraffic.add(source, userAgent, groupName, artist?._id)
}

export default RegisterAppTraffic