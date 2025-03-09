import axios, { Method } from 'axios'
import { Environment } from '../EnvironmentConfig'

const LocalAPIRequest = async<Response>(
  url: string,
  method: Method,
  data: any
): Promise<Response | null> => {
  try {
    const res = await axios.request({
      baseURL: '/api',
      headers: {
        'License': Environment.API_LICENSE
      },
      url,
      data,
      method
    })
    return res.data as Response
  } catch (error) {
    return null
  }
}

export default LocalAPIRequest