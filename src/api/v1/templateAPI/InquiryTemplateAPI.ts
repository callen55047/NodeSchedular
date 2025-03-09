import express from 'express'
import Logger from '../../../internal/Logger.js'
import { getUserFromRequest } from '../../shared/RequestContext.js'
import InquiryTemplate from '../../../models/templates/InquiryTemplate.js'

const router = express.Router()

router.get('/all', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const templates = await InquiryTemplate.find({ owner_id: user._id })
    return res.status(200).json(templates)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).send({ exception: 'Exception while getting all inquiry templates' })
  }
})

router.post('/create', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const { title, description, fields } = req.body

    await new InquiryTemplate({
      owner_id: user._id,
      title,
      description,
      fields
    }).save()

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).send({ exception: 'Exception while creating new template' })
  }
})

router.patch('/update', async (req, res) => {
  try {
    const { template } = req.body

    await InquiryTemplate.findByIdAndUpdate(template._id, { ...template })

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).send({ exception: 'Exception while creating new template' })
  }
})

export default router