import express from 'express'
import { getUserFromRequest } from '../shared/RequestContext.js'
import Account from '../../models/Account.js'
import StripeManager from '../../internal/payments/StripeManager.js'
import Logger from '../../internal/Logger.js'

const router = express.Router()

/**
 * Only artists create setup accounts
 */
router.post('/express/create', async (req, res) => {
  try {
    const stripe = await StripeManager.getStripeClient()
    const artist = getUserFromRequest(req)

    let stripe_id: string | null = artist.stripe_id

    // check validity of stripe_id with current master account
    if (stripe_id) {
      try {
        await stripe.accounts.retrieve(stripe_id)
      } catch (error) {
        Logger(req).error(`[stripe account retrieve] error: ${error}`)
        stripe_id = null
      }
    }
    // create new account if necessary
    if (!stripe_id) {
      const account = await stripe.accounts.create({ type: 'express' })
      await stripe.accounts.update(account.id, {
        settings: {
          payouts: {
            // attempt to retrieve negative balance from bank account
            debit_negative_balances: true
          }
        }
      })
      stripe_id = account.id
      await Account.findByIdAndUpdate(artist._id, { stripe_id })
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripe_id,
      refresh_url: 'https://domain.com/portal?stripe_return=true',
      return_url: 'https://domain.com/portal?stripe_refresh=true',
      type: 'account_onboarding'
    })

    return res.status(200).json({
      stripe_id,
      stripe_setup_url: accountLink.url,
      success: true
    })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while creating standard account' })
  }
})

router.get('/verify', async (req, res) => {
  try {
    const stripe = await StripeManager.getStripeClient()
    const artist = getUserFromRequest(req)

    const returnData = {
      email: "",
      charges_enabled: false,
      payouts_enabled: false,
      details_submitted: false,
      setup_url: "",
      login_url: ""
    }

    try {
      const account = await stripe.accounts.retrieve(artist.stripe_id)
      const setupLink = await stripe.accountLinks.create({
        account: artist.stripe_id,
        refresh_url: 'https://domain.com/portal?stripe_return=true',
        return_url: 'https://domain.com/portal?stripe_return=true',
        type: 'account_onboarding'
      })

      returnData.email = account.email || ""
      returnData.charges_enabled = account.charges_enabled
      returnData.payouts_enabled = account.payouts_enabled
      returnData.details_submitted = account.details_submitted
      returnData.setup_url = setupLink.url
    } catch (error) {}

    try {
      const loginLink = await stripe.accounts.createLoginLink(artist.stripe_id)
      returnData.login_url = loginLink.url
    } catch (error) {}

    return res.status(200).json(returnData)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while getting setup account' })
  }
})

export default router