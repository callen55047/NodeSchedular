import Logger from '../Logger.js'
import { Request } from 'express'

const OperationalTimer = (req?: Request) => {
  const start = new Date().getTime()

  return {
    complete: () => {
      const end = new Date().getTime()
      const duration = end - start
      Logger(req).info(`[${req?.url}] execution time: ${duration} milliseconds`)
    }
  }
}

export default OperationalTimer