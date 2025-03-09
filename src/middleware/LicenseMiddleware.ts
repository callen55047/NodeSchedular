import { Request, Response, NextFunction } from 'express'
import { Environment } from '../internal/EnvironmentConfig.js'

const LicenseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const license = req.headers['license']
    if (license !== Environment.API_LICENSE) {
      return res.status(401).json({ error: 'invalid license' })
    }

    return next()
  } catch (error) {
    console.log('[LicenseMiddleware exception]: ', error)
    return res.status(500).json({ exception: 'exception while parsing license' })
  }
}

export default LicenseMiddleware