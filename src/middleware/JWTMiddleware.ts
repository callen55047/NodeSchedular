import { Request, Response, NextFunction } from 'express'
import JWTAuthentication from '../auth/JWTAuthentication.js'
import Account from '../models/Account.js'

const JWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization' })
    }

    const jwtAuth = new JWTAuthentication()
    const accessToken = authHeader.slice(7)
    const accountId = await jwtAuth.decodeIdFromToken(accessToken)

    if (!accountId) {
      return res.status(401).json({ error: 'invalid token' })
    }

    const user = await Account.findById(accountId)
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    if (!user) {
      return res.status(401).json({ error: 'Invalid accountID' })
    }

    (req as any).user = user
    return next()
  } catch (error) {
    console.log('[JWTMiddleware exception]: ', error)
    return res.status(500).json({ exception: 'error while parsing token and getting user' })
  }
}

export default JWTMiddleware