import express from 'express'
import Logger from '../../internal/Logger.js'

const router = express.Router()

// used to listen for apple id email relay changes
// ApiController.use('/email', EmailUpdatesAPI)

router.all("/updates", async (req, res) => {
  try {
    Logger(req).info(
      `[email/updates]
        - body: ${req.body}
        - headers: ${req.headers} 
      `
    )
    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).send({ exception: 'Unable to handle response' })
  }
})

export default router