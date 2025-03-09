import express from 'express'
import Logger from '../../internal/Logger.js'
import GlobalEvents from '../../internal/events/GlobalEvents.js'
import { getUserFromRequest } from '../shared/RequestContext.js'
import { EAccountRole } from '../../models/Account.js'

const router = express.Router()

router.post('/artist-onboarded', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    
    if (user.role !== EAccountRole.ARTIST) {
      return res.status(400).json({ error: 'only artists can send this event' })
    }

    await GlobalEvents.artistOnboarded(user)
    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'could not send artist onboarding event' })
  }
})

export default router