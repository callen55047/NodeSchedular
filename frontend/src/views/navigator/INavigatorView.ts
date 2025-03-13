import { EStartPage } from '../../internal/models/settings/ArtistSettings'

type INavigatorView = {
  name: string,
  icon: string,
  params?: {
    [key: string]: any
  }
}

const NAVIGATOR_VIEWS = {
  DASHBOARD: { name: 'Dashboard', icon: 'fa-tachometer' } as INavigatorView,
  PROFILE: { name: 'Profile', icon: 'fa-user-circle' },
  // STOREFRONT: { name: 'Storefront', icon: 'fa-shopping-basket' },
  INQUIRIES: { name: 'Inquiries', icon: 'fa-stack-overflow' },
  MESSAGING: { name: 'Messaging', icon: 'fa-comment' },
  BOOKINGS: { name: 'Bookings', icon: 'fa-book' },
  // CALENDAR: { name: 'Calendar', icon: 'fa-calendar' },
  HISTORY: { name: 'History', icon: 'fa-history' },
  SETTINGS: { name: 'Settings', icon: 'fa-cog' },
  SUPPORT: { name: 'Support', icon: 'fa-wrench' },
  ADMIN: { name: 'Admin', icon: 'fa-user-secret' },
}

const parseNavigatorView = (value: EStartPage): INavigatorView => {
  switch (value) {
    case EStartPage.PROFILE:
      return NAVIGATOR_VIEWS.PROFILE
    case EStartPage.INQUIRIES:
      return NAVIGATOR_VIEWS.INQUIRIES
    case EStartPage.MESSAGES:
      return NAVIGATOR_VIEWS.MESSAGING
    case EStartPage.BOOKINGS:
      return NAVIGATOR_VIEWS.BOOKINGS
    default:
      return NAVIGATOR_VIEWS.DASHBOARD
  }
}

export {
  INavigatorView,
  NAVIGATOR_VIEWS,
  parseNavigatorView
}