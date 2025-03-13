import { useState } from 'react'
import { IArtistSettings } from '../models/settings/ArtistSettings'
import ApiController from '../../controllers/ApiController'
import { ITokenAuth } from '../models/Account'
import INotificationSettings from '../models/settings/NotificationSettings'

interface ISettingsStateManager {
  init: (api: ApiController, auth: ITokenAuth) => Promise<void>,
  updateArtist: (updatedSettings: IArtistSettings) => void,
  updateNotification: (updatedSettings: INotificationSettings) => void,
  artistSettings: IArtistSettings,
  notificationSettings: INotificationSettings
}

const SettingsStateManager = (): ISettingsStateManager => {
  const [settings, setSettings] = useState({} as IArtistSettings)
  const [notificationSettings, setNotificationSettings] = useState({} as INotificationSettings)

  return {
    init: async (api: ApiController, auth: ITokenAuth): Promise<void> => {
      const response = await api.artistSettings.get(auth)
      if (response) {
        setSettings(response)
      } else {
        console.warn('failed to load initial settings')
      }

      const notifResponse = await api.notificationSettings.get(auth)
      if (notifResponse) {
        setNotificationSettings(notifResponse)
      } else {
        console.warn('failed to load notification settings')
      }
    },

    updateArtist: (updatedSettings: IArtistSettings) => {
      setSettings({ ...updatedSettings })
    },

    updateNotification: (updatedSettings: INotificationSettings) => {
      setNotificationSettings({ ...updatedSettings })
    },

    artistSettings: settings,
    notificationSettings
  }
}

export default SettingsStateManager

export {
  ISettingsStateManager
}