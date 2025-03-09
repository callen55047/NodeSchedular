import express from 'express'
import InquiryTemplateAPI from './templateAPI/InquiryTemplateAPI.js'

const router = express.Router()

router.use('/inquiry', InquiryTemplateAPI)

export default router