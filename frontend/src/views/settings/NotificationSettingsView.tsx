import React, { useContext, useState } from 'react'
import { Tile, TileHeadingAndSub, TileRowContainer } from '../components/TileLayout'
import { HorizontalSpacer, SInput, VerticalSpacer } from '../components/ViewElements'
import { SectionHeading } from './SettingsViewComps'
import { FlexBox } from '../components/view/FlexLayouts'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { SettingsContext } from './SettingsContext'
import { SCheckBox } from '../components/Inputs'
import { SimpleButton } from '../components/Buttons'
import { BaseText } from '../../theme/CustomText'
import { Colors } from '../../theme/Theme'
import { toast } from 'react-toastify'

export default function NotificationSettingsView() {
  const { api, runBlocking } = useContext(AppInstance)
  const { notificationSettings, setNotificationSettings, save } = useContext(SettingsContext)
  const [error, setError] = useState<string>('')
  const [retryCount, setRetryCount] = useState(0)

  function isTenDigitNumber(input: string): boolean {
    return /^\d{10}$/.test(input)
  }

  function verifyNumber() {
    if (retryCount > 2) {
      setError('Max retry count reached. Please try again later.')
      return
    }

    if (!isTenDigitNumber(notificationSettings.sms_number)) {
      setError('Please enter a 10 digit phone number')
      return
    }

    setError('')
    runBlocking(async () => {
      const res = await api.notificationSettings
        .testSMS(notificationSettings.sms_number)
      if (res?.success) {
        toast.success('Message sent! Please verify that you received the text message')
        save()
      }
      setRetryCount(retryCount + 1)
    })
  }

  return (
    <TileRowContainer>
      <Tile>
        <TileHeadingAndSub
          title={'Notifications'}
          sub={'Receive updates for new inquiries, booking updates, etc.'}
        />
        <VerticalSpacer size={30} />

        <SectionHeading name={'Enter a mobile number'} />

        <FlexBox justify={'flex-start'}>
          <SCheckBox
            text={'Enabled'}
            checked={notificationSettings.sms_enabled}
            onChange={(newValue) => {
              setNotificationSettings({ ...notificationSettings, sms_enabled: newValue })
            }}
          />
        </FlexBox>

        {notificationSettings.sms_enabled &&
          <>
            <FlexBox justify={'flex-start'}>
              <SInput
                onChange={(v) => setNotificationSettings({ ...notificationSettings, sms_number: v })}
                type={'tel'}
                value={notificationSettings.sms_number}
                minHeight={40}
              />
              <HorizontalSpacer size={10} />
              <SimpleButton
                theme={'SECONDARY'}
                text={'Send test'}
                action={verifyNumber}
              />
            </FlexBox>
            {error &&
              <>
                <VerticalSpacer size={5} />
                <BaseText text={error} color={Colors.RED_00} />
              </>
            }
          </>
        }
      </Tile>
    </TileRowContainer>
  )
}