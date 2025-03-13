import React, { useContext, useState } from 'react'
import PaymentSettings from './settings/PaymentSettings'
import ScheduleSettings from './settings/ScheduleSettings'
import GeneralSettings from './settings/GeneralSettings'
import { FlexBox } from './components/view/FlexLayouts'
import { VerticalSpacer } from './components/ViewElements'
import { SimpleButton } from './components/Buttons'
import { AppInstance } from '../appEntry/appContainer/AppContext'
import { SettingsContext } from './settings/SettingsContext'
import { toast } from 'react-toastify'
import InquirySettings from './settings/InquirySettings'
import NotificationSettingsView from './settings/NotificationSettingsView'

export default function SettingsView() {
  const { settingsManager, runBlocking, api } = useContext(AppInstance)
  const [localArtistSettings, setLocalArtistSettings] = useState(settingsManager.artistSettings)
  const [localNotificationSettings, setLocalNotificationSettings] = useState(settingsManager.notificationSettings)

  const shopChanges = JSON.stringify(localArtistSettings) !== JSON.stringify(settingsManager.artistSettings)
  const notifChanges = JSON.stringify(localNotificationSettings) !== JSON.stringify(settingsManager.notificationSettings)
  const hasChanges = notifChanges || shopChanges

  function saveSettings() {
    if (!hasChanges) {
      return
    }

    runBlocking(async () => {
      if (shopChanges) {
        const res = await api.artistSettings.update(localArtistSettings)
        if (res?.success) {
          settingsManager.updateArtist(localArtistSettings)
        } else {
          toast.error('Unable to update settings.')
          return
        }
      }

      if (notifChanges) {
        const notifRes = await api.notificationSettings.update(localNotificationSettings)
        if (notifRes?.success) {
          settingsManager.updateNotification(localNotificationSettings)
        } else {
          toast.error('Unable to update notification settings.')
          return
        }
      }

      toast.success('Settings updated successfully.')
    })
  }

  const context = {
    artistSettings: localArtistSettings,
    notificationSettings: localNotificationSettings,
    setArtistSettings: setLocalArtistSettings,
    setNotificationSettings: setLocalNotificationSettings,
    save: saveSettings
  }

  return (
    <SettingsContext.Provider value={context}>

      <GeneralSettings />

      <PaymentSettings />

      <NotificationSettingsView />

      <InquirySettings />

      <ScheduleSettings />

      <FlexBox
        justify={'flex-start'}
        style={{
          position: 'absolute',
          bottom: 18,
          right: 18
        }}
      >
        <SimpleButton
          theme={'SUCCESS'}
          text={'Save'}
          action={saveSettings}
          isDisabled={!hasChanges}
        />
      </FlexBox>
      <VerticalSpacer size={30} />

    </SettingsContext.Provider>
  )
}
