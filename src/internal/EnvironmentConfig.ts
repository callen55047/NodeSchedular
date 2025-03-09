const DB_NAME = process.env.DB_NAME
const DB_CLUSTER_NAME = process.env.DB_CLUSTER_NAME
const DB_USER = 'admin'
const DB_PASSWORD = process.env.MONGODB_PASSWORD
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
const NODE_ENV = (process.env.NODE_ENV || "").trim()

enum ENodeEnvironment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

const Environment = {

  getEnv: (): string => {
    switch (NODE_ENV) {
      case ENodeEnvironment.LOCAL:
        return ENodeEnvironment.LOCAL
      case ENodeEnvironment.DEVELOPMENT:
        return ENodeEnvironment.DEVELOPMENT
      default:
        return ENodeEnvironment.PRODUCTION
    }
  },

  isProduction: (): boolean => {
    return Environment.getEnv() === ENodeEnvironment.PRODUCTION
  },

  getDatabaseUrl: (): string => {
    // alert here if keys are not set properly from devOps
    return `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER_NAME}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
  },

  getStripeSecret: (): string => {
    // alert here if keys are not set properly from devOps
    return STRIPE_SECRET_KEY!
  },

  AWS_ACCESS_KEY: AWS_ACCESS_KEY,
  AWS_SECRET_KEY: AWS_SECRET_KEY,
  API_LICENSE: 'sample-private-license-for-known-app-connections'
}

const DatabaseOptions = {
  dbName: DB_NAME
}

// used for single sign-on services
const GoogleAuthConfig = {
  CLIENT_ID: '',
  ANDROID_CLIENT_IDS: []
}

// used for sending email notifications with NodeMailer
const EmailConfig = {
  REFRESH_TOKEN: '',
  CLIENT_SECRET: '',
  CLIENT_ID: '',
  PLAYGROUND: '',

  NOTIFICATIONS: {
    EMAIL: 'example@domain.com',
    APP_PASSWORD: 'samplePassword1234'
  }
}

const ZenDeskConfig = {
  email: '',
  url: '',
  apiToken: '',

  // base64 encoded string = `${email}/token:${apiToken}`
  // NOTE: when generating base64 string in typescript, it will produce an inaccurate result that zendesk will reject.
  // To fix this, generate the base64 string and save it as a constant here
  authEncoded: ''
}

// used for sending text message notifications
const TwilioConfig = {
  ACCOUNT_SID: '',
  AUTH_TOKEN: '',
  NUMBER: ''
}

export {
  Environment,
  DatabaseOptions,
  GoogleAuthConfig,
  EmailConfig,
  ZenDeskConfig,
  TwilioConfig
}