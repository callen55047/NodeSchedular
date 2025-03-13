import axios, { AxiosInstance, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import { IPortalUser, ITokenAuth } from '../internal/models/Account'
import StripeAPI from './api/StripeAPI'
import AccountAPI from './api/AccountAPI'
import SocketAPI from './api/SocketAPI'
import SessionAPI from './api/SessionAPI'
import InquiryAPI from './api/InquiryAPI'
import ThreadsAPI from './api/ThreadsAPI'
import AuthAPI from './api/AuthAPI'
import FileAPI from './api/FileAPI'
import SkillAPI from './api/SkillAPI'
import TransactionAPI from './api/TransactionAPI'
import PortalConfig from '../internal/PortalConfig'
import ArtistSettingsAPI from './api/ArtistSettingsAPI'
import AdminAPI from './api/AdminAPI'
import AppTrafficAPI from './api/AppTrafficAPI'
import FlashProductAPI from './api/FlashProductAPI'
import InquiryTemplateAPI from './api/InquiryTemplateAPI'
import FinancialReportAPI from './api/FinancialReportAPI'
import EventAPI from './api/EventAPI'
import NotificationSettingsAPI from './api/NotificationSettingsAPI'

// TODO: try and make static instance
export default class ApiController {
  private readonly axios: AxiosInstance
  private readonly refreshToken: string = ''
  private readonly accessToken: string = ''
  private updateAuthEvent?: (auth: ITokenAuth) => void
  private authErrorEvent?: (error: string) => void

  auth: AuthAPI
  account: AccountAPI
  stripe: StripeAPI
  socket: SocketAPI
  session: SessionAPI
  inquiry: InquiryAPI
  threads: ThreadsAPI
  file: FileAPI
  skills: SkillAPI
  transaction: TransactionAPI
  artistSettings: ArtistSettingsAPI
  notificationSettings: NotificationSettingsAPI
  admin: AdminAPI
  appTraffic: AppTrafficAPI
  flashProduct: FlashProductAPI
  inquiryTemplate: InquiryTemplateAPI
  financialReport: FinancialReportAPI
  event: EventAPI

  constructor(currentUser: IPortalUser | null) {
    this.axios = axios.create({
      baseURL: 'api/'
    })

    if (currentUser) {
      this.refreshToken = currentUser.refresh_token
      this.accessToken = currentUser.access_token

      this.buildRefreshInterceptor()
    }

    this.auth = new AuthAPI(this)
    this.account = new AccountAPI(this)
    this.stripe = new StripeAPI(this)
    this.socket = new SocketAPI(this)
    this.session = new SessionAPI(this)
    this.inquiry = new InquiryAPI(this)
    this.threads = new ThreadsAPI(this)
    this.file = new FileAPI(this)
    this.skills = new SkillAPI(this)
    this.transaction = new TransactionAPI(this)
    this.artistSettings = new ArtistSettingsAPI(this)
    this.notificationSettings = new NotificationSettingsAPI(this)
    this.admin = new AdminAPI(this)
    this.appTraffic = new AppTrafficAPI(this)
    this.flashProduct = new FlashProductAPI(this)
    this.inquiryTemplate = new InquiryTemplateAPI(this)
    this.financialReport = new FinancialReportAPI(this)
    this.event = new EventAPI(this)
  }

  private buildRefreshInterceptor() {
    this.axios.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = { ...error.config }
        // workaround for contentType getting set to "plainText" on retry
        originalRequest.headers = JSON.parse(JSON.stringify(originalRequest.headers || {})) as RawAxiosRequestHeaders

        // only unauthorized 401 responses are handled
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          try {
            originalRequest._retry = true

            const payload = await this.auth.refreshAccessToken(this.refreshToken)
            if (!payload?.access_token) {
              throw Error('Failed to fetch new access token')
            }

            if (this.updateAuthEvent) {
              this.updateAuthEvent({ access_token: payload.access_token, refresh_token: this.refreshToken })
            }
            originalRequest.headers['Authorization'] = `Bearer ${payload.access_token}`
            return this.axios.request(originalRequest)

          } catch (refreshError) {
            if (this.authErrorEvent) {
              this.authErrorEvent(`${refreshError}`)
            } else {
              throw refreshError
            }
          }
        }

        return Promise.reject(error)
      }
    )
  }

  onUpdateAuth(event: (auth: ITokenAuth) => void): ApiController {
    this.updateAuthEvent = event
    return this
  }

  onAuthError(event: (error: string) => void): ApiController {
    this.authErrorEvent = event
    return this
  }

  async dataTask<T>(
    url: string,
    method: AxiosRequestConfig['method'],
    data: any | undefined = undefined,
    token: string | undefined = undefined
  ): Promise<T | null> {
    try {
      const res = await this
        .axios({
          method,
          url,
          headers: {
            'License': PortalConfig.API_LICENSE,
            'Authorization': `Bearer ${token || this.accessToken}`
          },
          data
        })
      return res.data as T
    } catch (error) {
      return null
    }
  }

  async binaryDataTask<T>(
    url: string,
    method: AxiosRequestConfig['method'],
    data: any
  ): Promise<T> {
    return this
      .axios({
        method,
        url,
        headers: {
          'License': PortalConfig.API_LICENSE,
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
        data
      })
      .then(result => result.data)
  }
}