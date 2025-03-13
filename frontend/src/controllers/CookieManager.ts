import { useCookies } from 'react-cookie'
import { PLATFORM_COOKIE, USER_TOKEN } from '../types/Constants'

interface ICookieManager {
  getRefreshToken: () => string,
  setRefreshToken: (token: string) => void,
  clearRefreshToken: () => void,
}

const CookieManager = (): ICookieManager => {
  const [cookie, setCookie, removeCookie] = useCookies<string>([PLATFORM_COOKIE])

  return {

    getRefreshToken: () => cookie[USER_TOKEN] as string,

    setRefreshToken: (token: string) => {
      const date = new Date()
      date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days
      setCookie(USER_TOKEN, token, { path: '/', expires: date })
    },

    clearRefreshToken: () => removeCookie(USER_TOKEN)
  }
}

export {
  ICookieManager
}

export default CookieManager