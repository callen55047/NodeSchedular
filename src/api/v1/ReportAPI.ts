import express from 'express'
import FinancialReportAPI from './reportAPI/FinancialReportAPI.js'

const router = express.Router()

router.use('/financial', FinancialReportAPI)

export default router