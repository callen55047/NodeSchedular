import express from 'express'
import Logger from '../../internal/Logger.js'
import AppTraffic, { trafficSourceFromString } from '../../models/AppTraffic.js'

const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const { source, account_id, group_name, device_info } = req.body

    await new AppTraffic({
      source: trafficSourceFromString(source),
      account_id,
      group_name,
      device_info,
    }).save()

    return res.status(200).send({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while registering app traffic' })
  }
})

router.get('/all', async (req, res) => {
  try {
    const traffic = await AppTraffic
      .find()
      .populate('account_id')

    return res.status(200).send(traffic)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while registering app traffic' })
  }
})

export default router