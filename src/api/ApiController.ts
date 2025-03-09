import express from 'express'
import bodyParser from 'body-parser'
import AccountAPI from './v1/AccountAPI.js'
import LicenseMiddleware from '../middleware/LicenseMiddleware.js'
import JWTMiddleware from '../middleware/JWTMiddleware.js'
import AuthAPI from './v1/AuthAPI.js'
import DataFetchAPI from './v1/DataFetchAPI.js'
import InquiryAPI from './v1/InquiryAPI.js'
import MessageAPI from './v1/MessageAPI.js'
import SessionAPI from './v1/SessionAPI.js'
import SkillAPI from './v1/SkillAPI.js'
import StripeAPI from './v1/StripeAPI.js'
import HomeFeedAPI from './v1/HomeFeedAPI.js'
import FileAPI from './v1/FileAPI.js'
import TransactionAPI from './v1/TransactionAPI.js'
import SettingsAPI from './v1/SettingsAPI.js'
import AdminAPI from './v1/AdminAPI.js'
import AppTrafficAPI from './v1/AppTrafficAPI.js'
import ProductAPI from './v1/ProductAPI.js'
import TemplateAPI from './v1/TemplateAPI.js'
import ReportAPI from './v1/ReportAPI.js'
import EventAPI from './v1/EventAPI.js'

const ApiController = express.Router()

ApiController.use(bodyParser.urlencoded({ extended: true }))
ApiController.use(bodyParser.json())

// LICENSE FIREWALL -------------------
ApiController.use(LicenseMiddleware)

ApiController.use('/auth', AuthAPI)
ApiController.use('/traffic', AppTrafficAPI)

// BEARER TOKEN FIREWALL -------------------
ApiController.use(JWTMiddleware)

ApiController.use('/admin', AdminAPI)
ApiController.use('/account', AccountAPI)
ApiController.use('/settings', SettingsAPI)
ApiController.use('/feed', HomeFeedAPI)
ApiController.use('/skills', SkillAPI)
ApiController.use('/data-fetch', DataFetchAPI)
ApiController.use('/inquiry', InquiryAPI)
ApiController.use('/message', MessageAPI)
ApiController.use('/session', SessionAPI)
ApiController.use('/stripe', StripeAPI)
ApiController.use('/file', FileAPI)
ApiController.use('/transaction', TransactionAPI)
ApiController.use('/product', ProductAPI)
ApiController.use('/template', TemplateAPI)
ApiController.use('/report', ReportAPI)
ApiController.use('/event', EventAPI)

export default ApiController