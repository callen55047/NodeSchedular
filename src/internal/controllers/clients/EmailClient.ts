import nodemailer, { Transporter } from 'nodemailer'
import { google } from 'googleapis'
import { EmailConfig } from '../../EnvironmentConfig.js'
import Logger from '../../Logger.js'

// const OAuth2 = google.auth.OAuth2

const createTransporter = async (): Promise<Transporter> => {
  // const oauthClient = new OAuth2(
  //   EmailConfig.CLIENT_ID,
  //   EmailConfig.CLIENT_SECRET,
  //   EmailConfig.PLAYGROUND
  // )

  // oauthClient.setCredentials({
  //   refresh_token: EmailConfig.REFRESH_TOKEN
  // })
  //
  // const accessToken = await new Promise((resolve, reject) => {
  //   oauthClient.getAccessToken((err, token) => {
  //     if (err) {
  //       reject('Failed to create access token :(')
  //     }
  //     resolve(token)
  //   })
  // })

  return nodemailer.createTransport({
    // @ts-ignore
    service: 'Gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EmailConfig.NOTIFICATIONS.EMAIL,
      pass: EmailConfig.NOTIFICATIONS.APP_PASSWORD,
    },
  })
}

const EmailClient = {

  trySendEmail: async (message: any) => {
    try {
      const transporter = await createTransporter()
      await transporter.sendMail(message)
      transporter.close()
    } catch (error) {
      Logger().exception(error)
    }
  }
}

export default EmailClient