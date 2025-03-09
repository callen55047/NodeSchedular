import { google } from 'googleapis'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { GoogleAuthConfig } from '../internal/EnvironmentConfig.js'

enum EPartnerLogin {
  GOOGLE = 'google',
  APPLE = 'apple'
}

interface IAuthClientInfo {
  email: string,
  username: string,
  first_name: string,
  last_name: string
}

const getPartnerLoginType = (type: string): EPartnerLogin => {
  if (type === EPartnerLogin.APPLE) {
    return EPartnerLogin.APPLE
  }

  return EPartnerLogin.GOOGLE
}

const PartnerVerify = {

  withGoogle: async (idToken: string): Promise<IAuthClientInfo> => {
    const client = new google.auth.OAuth2()
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [GoogleAuthConfig.CLIENT_ID, ...GoogleAuthConfig.ANDROID_CLIENT_IDS]
    })
    const payload = ticket.getPayload()

    const email = payload!.email as string
    const first_name = payload!.given_name as string
    const last_name = payload!.family_name as string
    const username = `${first_name}${last_name}`

    return {
      email,
      username,
      first_name,
      last_name
    }
  },

  withApple: async (idToken: string): Promise<IAuthClientInfo> => {
    const client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys'
    })

    function getKey(header: any, callback: any) {
      client.getSigningKey(header.kid, (_, key) => {
        const signingKey = key?.getPublicKey()
        callback(null, signingKey)
      })
    }

    const options = {
      audience: 'com.example.appID',
      issuer: 'https://appleid.apple.com'
    }

    const data = await new Promise((resolve, reject) => {
      jwt.verify(idToken, getKey, options, (err, payload) => {
        if (err) {
          reject(`Token verification failed: ${err}`)
        }
        resolve(payload)
      })
    })

    const payload = data as any
    const email = payload.email as string
    const first_name = 'User'
    const last_name = 'Apple'
    const username = email.split('@')[0]

    return {
      email,
      username,
      first_name,
      last_name
    }
  }
}

const PartnerAuthLogin = async (idToken: string, partner: string): Promise<IAuthClientInfo> => {
  const partnerType = getPartnerLoginType(partner)

  switch (partnerType) {
    case EPartnerLogin.GOOGLE:
      return PartnerVerify.withGoogle(idToken)
    case EPartnerLogin.APPLE:
      return PartnerVerify.withApple(idToken)
  }
}

export default PartnerAuthLogin

export {
  EPartnerLogin,
  getPartnerLoginType
}