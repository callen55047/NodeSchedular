const USER_TOKEN = 'user_token'
const PLATFORM_COOKIE = 'node_schedular'
const STRIPE_SETUP_ATTEMPT = 'stripe_setup_attempt'
const RESEND_EMAIL_VERIFICATION = 'resend_email_verification'

enum EGlobalZIndex {
  POPOVER = 1050,
  CONFIRMATION_MODAL = 1100,
  LOADING_MODAL = 1150,
  SESSION_EXPIRED_MODAL = 1200
}

export {
  USER_TOKEN,
  PLATFORM_COOKIE,
  STRIPE_SETUP_ATTEMPT,
  RESEND_EMAIL_VERIFICATION,
  EGlobalZIndex
}