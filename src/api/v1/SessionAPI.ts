import express from 'express'
import ArtistSessionAPI from './sessionAPI/ArtistSessionAPI.js'
import UserSessionAPI from './sessionAPI/UserSessionAPI.js'

const router = express.Router()

router.use('/artist', ArtistSessionAPI)
router.use('/user', UserSessionAPI)

export default router