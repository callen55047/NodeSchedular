import React, { useContext, useState } from 'react'
import { FlexBox } from '../../components/view/FlexLayouts'
import { Colors } from '../../../theme/Theme'
import { BaseText, Text24 } from '../../../theme/CustomText'
import { VerticalSpacer } from '../../components/ViewElements'
import { BaseButton, SimpleButton } from '../../components/Buttons'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { InsetLabeledInput } from '../../components/Inputs'
import { ErrorTextBlock } from '../../components/HorizontalMessageBox'
import { SequenceContext } from '../../../appEntry/sequenceController/SequenceContext'
import SetupContainerView from '../SetupContainerView'

export default function VerifyEmail() {
  const {
    api,
    logout,
    runBlocking,
    currentUser,
    setCurrentUser
  } = useContext(AppInstance)
  const { goToStep } = useContext(SequenceContext)
  const [text, setText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [canSendAnotherEmail, setCanSendAnotherEmail] = useState(true)

  function verify() {
    if (!text) {
      return
    }

    setErrorText('')

    runBlocking(async () => {
      try {
        const res = await api.account.verifyEmail(text)
        if (res?.success) {
          setCurrentUser({ ...currentUser!, email_verified: true })
          goToStep('BASIC_INFO')
        }
      } catch (error) {
        setErrorText('Error: unable to verify email code. Please make sure you ' +
          'entered the code correctly.')
      }
    })
  }

  function resendEmail() {
    runBlocking(async () => {
      await api.account.resendEmailVerification()
      setCanSendAnotherEmail(false)
    })
  }

  return (
    <SetupContainerView current={1} title={'Verify Email'}>
      <BaseText
        text={'A verification code has been sent to your email'}
        alignment={'center'}
      />
      <VerticalSpacer size={10} />
      {errorText &&
        <>
          <ErrorTextBlock text={errorText} />
          <VerticalSpacer size={10} />
        </>
      }
      <InsetLabeledInput
        label={'Code'}
        value={text}
        onChange={(value) => setText(value as string)}
      />
      <VerticalSpacer size={20} />
      <FlexBox>
        {canSendAnotherEmail &&
          <SimpleButton
            theme={'SECONDARY'}
            text={'Resend email'}
            action={resendEmail}
          />
        }
        <SimpleButton
          theme={'SUCCESS'}
          action={verify}
          text={'Verify code'}
        />
      </FlexBox>
      <VerticalSpacer size={20} />
      <BaseButton
        background={Colors.TRANSPARENT}
        action={logout}
        text={'Logout'}
      />
      <VerticalSpacer size={10} />
    </SetupContainerView>
  )
}