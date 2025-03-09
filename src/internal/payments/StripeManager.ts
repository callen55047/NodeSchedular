import Stripe from 'stripe'
import { Environment } from '../EnvironmentConfig.js'

const StripeManager = {

  getStripeClient: async (): Promise<Stripe> => {
    return new Stripe(
      Environment.getStripeSecret(),
      { apiVersion: '2023-08-16' }
    )
  }

}

export default StripeManager