import express from 'express'
import { getUserFromRequest } from '../../shared/RequestContext.js'
import Logger from '../../../internal/Logger.js'
import NotificationSettings, { INotificationSettings } from '../../../models/settings/NotificationSettings.js'
import TextingClient from '../../../internal/controllers/clients/TextingClient.js'

const router = express.Router()

router.get(`/get`, async (req, res) => {
  try {
    const user = getUserFromRequest(req)

    let notificationSettings = await NotificationSettings.findOne({ owner_id: user._id })
    if (!notificationSettings) {
      notificationSettings = await new NotificationSettings({ owner_id: user._id }).save()
    }

    return res.status(200).json(notificationSettings)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while getting notification settings' })
  }
})

router.post(`/update`, async (req, res) => {
  try {
    const updatedSettings = req.body.settings as INotificationSettings
    await NotificationSettings.findByIdAndUpdate(updatedSettings._id, { ...updatedSettings })

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while updating notification settings' })
  }
})

router.post(`/test-sms`, async (req, res) => {
  try {
    const { sms_number } = req.body
    await TextingClient()
      .tryDirectMessage(
        sms_number,
        'Hey there! this is a test message from the NodeSchedular Artist Portal'
      )

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: `Error while testing SMS number: ${req.body.sms_number}` })
  }
})

export default router