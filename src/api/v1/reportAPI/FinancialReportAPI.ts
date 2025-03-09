import express from 'express'
import Logger from '../../../internal/Logger.js'
import { getUserFromRequest } from '../../shared/RequestContext.js'
import ReportBuilder from '../../../internal/ReportBuilder.js'

const router = express.Router()

router.get('/sales', async (req, res) => {
  try {
    const user = getUserFromRequest(req)

    const sales = await ReportBuilder.cardAndCashSales(user)

    return res.status(200).json(sales)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'exception while building sales report' })
  }
})

export default router