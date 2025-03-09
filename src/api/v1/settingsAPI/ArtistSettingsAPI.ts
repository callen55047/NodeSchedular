import express from 'express'
import { getUserFromRequest } from '../../shared/RequestContext.js'
import Settings, { IArtistSettings } from '../../../models/settings/ArtistSettings.js'
import Logger from '../../../internal/Logger.js'

const router = express.Router()

router.get(`/get`, async (req, res) => {
  try {
    const user = getUserFromRequest(req)

    let settings = await Settings.findOne({ owner_id: user._id })
    if (!settings) {
      settings = await new Settings({ owner_id: user._id }).save()
    }

    return res.status(200).json(settings)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while getting settings' })
  }
})

router.post(`/update`, async (req, res) => {
  try {
    const updatedSettings = req.body.settings as IArtistSettings
    await Settings.findByIdAndUpdate(updatedSettings._id, { ...updatedSettings })

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while updating settings' })
  }
})

export default router