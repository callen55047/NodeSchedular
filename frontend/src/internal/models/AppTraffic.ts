import { IAccount } from './Account'

interface IAppTraffic {
  _id: string,
  account_id: IAccount | null
  source: string,
  group_name: string | null,
  device_info: string,
  created_at: string
}

export {
  IAppTraffic
}