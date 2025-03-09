import Account, { IAccount } from '../models/Account.js'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'

export default class JWTAuthentication {
  private JWT_SECRET = 'hMH6jrXi&3^1hgy$OW$NyM9nUZXYoeUBsIa*$9Ow$Tv3LVV1&gVtSE*dVsYiFf4XM4%1oAJltJfpoXn$zQY7FhDzKTDcb^LW'
  private account: IAccount | undefined

  constructor(account?: IAccount) {
    this.account = account
  }

  withUser(account: IAccount) {
    this.account = account
  }

  generateAccessToken() {
    return jwt.sign(
      { accountId: this.account!._id },
      this.JWT_SECRET,
      { expiresIn: '1d' }
    )
  }

  generateRefreshToken() {
    return jwt.sign(
      { accountId: this.account!._id },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    )
  }

  async decodeIdFromToken(token: string): Promise<Types.ObjectId | null> {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(token, this.JWT_SECRET, (err, decodedToken) => {
          const accountId = (decodedToken as any).accountId
          resolve(accountId)
        })
      } catch (error) {
        resolve(null)
      }
    })
  }

  async verifyRTAndGetUserAccount(token: string): Promise<IAccount | null> {
    try {
      const accountId = await new Promise((resolve, reject) => {
        jwt.verify(token, this.JWT_SECRET, (err, decodedToken) => {
          if (err) {
            reject(err)
          }

          // TODO: verify token is not contained in blacklist
          const accountId = (decodedToken as any).accountId
          resolve(accountId)
        })
      })
      return Account.findById(accountId)
    } catch (error) {
      return null
    }
  }
}