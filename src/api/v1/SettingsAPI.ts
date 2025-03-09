import express from 'express'
import NotificationSettingsAPI from './settingsAPI/NotificationSettingsAPI.js'
import ArtistSettingsAPI from './settingsAPI/ArtistSettingsAPI.js'

const router = express.Router()

router.use('/artist', ArtistSettingsAPI)

router.use('/notifications', NotificationSettingsAPI)

export default router