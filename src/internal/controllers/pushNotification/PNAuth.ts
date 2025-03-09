import PNControllerChild from './PNControllerChild.js'
import FixedWidthEmail from './FixedWidthEmail.js'
import VerifTokenManager from '../../VerifTokenManager.js'
import HtmlComponents from './HtmlComponents.js'

export default class PNAuth extends PNControllerChild {

  async verifyEmail(): Promise<void> {
    const verificationCode = await VerifTokenManager.generateNewUserToken(this.controller.receiver!)
    const email = {
      subject: `[NodeSchedular] - Verify Email`,
      html: FixedWidthEmail(
        "Welcome to the platform",
        "Use the code below to verify this email",
        `<p style="font-size: 24px">${verificationCode}</p>`
      )
    }
    return this.controller.sendEmail(email)
  }

  async resetPassword(): Promise<void> {
    const verificationCode = await VerifTokenManager.generateNewUserToken(this.controller.receiver!)
    const email = {
      subject: `[NodeSchedular] - Reset Password`,
      html: FixedWidthEmail(
        "Password reset",
        "Use the link below to open the password reset page and use this code to confirm.",
        `<div>
                <p style="font-size: 24px">${verificationCode}</p>
                </br>
                <a href='https://domain.com/reset-password'>Set new password here</a>
              </div>`
      )
    }
    return this.controller.sendEmail(email)
  }

  async passwordResetComplete(): Promise<void> {
    const email = {
      subject: `[NodeSchedular] - Password has been Reset`,
      html: FixedWidthEmail(
        "Password has been successfully reset",
        "If this was not you, please contact our support immediately.",
        `<div>
                <a href='https://domain.com/support-request'>Platform support</a>
              </div>`
      )
    }
    return this.controller.sendEmail(email)
  }

  async onboardArtist(password: string): Promise<void> {
    const email = {
      subject: `[NodeSchedular] - Welcome Aboard`,
      html: FixedWidthEmail(
        "Welcome to the platform",
        "We've set up an account login for you on our portal.",
        `
        ${HtmlComponents.onboardingArtist(this.controller.receiver!, password)}
        `
      )
    }
    return this.controller.sendEmail(email)
  }
}