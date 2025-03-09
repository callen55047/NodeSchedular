import express from "express"
import FlashProductAPI from './productAPI/FlashProductAPI.js'

const router = express.Router()

router.use('/flash', FlashProductAPI)

export default router