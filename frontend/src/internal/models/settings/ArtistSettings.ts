import { IAddress } from '../shared/Address'

enum ETimeSlotIncrements {
  HOUR = 'hour',
  HALF = 'half',
  QUARTER = 'quarter'
}

enum EStartPage {
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
  INQUIRIES = 'inquiries',
  MESSAGES = 'messages',
  BOOKINGS = 'bookings'
}

enum EPayoutFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

interface IArtistSettings {
  _id: string,
  portal_start_page: EStartPage,
  custom_studio_address: IAddress | null,
  default_booking_length: number,
  time_slot_increments: ETimeSlotIncrements,
  recurring_days_off: string[],
  daily_work_hours: {
    start_time: string,
    end_time: string
  },
  session_buffer_time: {
    enabled: boolean,
    before: number,
    after: number
  },
  default_deposit: number,
  default_price: number,
  default_price_includes_tax: boolean,
  custom_inquiry_id: string | null
}

export {
  IArtistSettings,
  ETimeSlotIncrements,
  EStartPage,
  EPayoutFrequency
}