import { IArtistSettings } from '../../internal/models/settings/ArtistSettings'
import { createContext } from 'react'
import INotificationSettings from '../../internal/models/settings/NotificationSettings'

interface ISettingsContext {
  artistSettings: IArtistSettings,
  notificationSettings: INotificationSettings,
  setArtistSettings: (settings: IArtistSettings) => void,
  setNotificationSettings: (settings: INotificationSettings) => void,
  save: () => void
}

export const SettingsContext = createContext<ISettingsContext>({} as ISettingsContext)