import { INavigatorView, NAVIGATOR_VIEWS } from './INavigatorView'
import Dashboard from '../Dashboard'
import ProfileView from '../ProfileView'
import Inquiries from '../Inquiries'
import Messaging from '../Messaging'
import Bookings from '../Bookings'
import History from '../History'
import SettingsView from '../SettingsView'
import Support from '../Support'
import AdminPanel from '../AdminPanel'
import React from 'react'

export default function NavigatorViewSwitch(props: { view: INavigatorView }) {
  switch (props.view.name) {
    case NAVIGATOR_VIEWS.DASHBOARD.name:
      return <Dashboard />
    case NAVIGATOR_VIEWS.PROFILE.name:
      return <ProfileView />
    // case NAVIGATOR_VIEWS.STOREFRONT.name:
    //   return <StoreFront />
    case NAVIGATOR_VIEWS.INQUIRIES.name:
      return <Inquiries />
    case NAVIGATOR_VIEWS.MESSAGING.name:
      return <Messaging />
    case NAVIGATOR_VIEWS.BOOKINGS.name:
      return <Bookings view={props.view} />
    // TODO: create new calendar view
    // case NAVIGATOR_VIEWS.CALENDAR.name:
    //   return <CalendarView />
    case NAVIGATOR_VIEWS.HISTORY.name:
      return <History />
    case NAVIGATOR_VIEWS.SETTINGS.name:
      return <SettingsView />
    case NAVIGATOR_VIEWS.SUPPORT.name:
      return <Support />
    case NAVIGATOR_VIEWS.ADMIN.name:
      return <AdminPanel />
    default:
      console.warn(`[Navigator] view '${props.view.name}' is not valid`)
      return <Dashboard />
  }
}