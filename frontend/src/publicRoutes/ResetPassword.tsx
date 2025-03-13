import React, { useState } from 'react'
import { ThemedAppContainer } from '../views/components/view/Containers'
import { FixedWidthVerticalContainer, PublicHeaderWithErrorMessage, SuccessOrContent } from './shared/ViewContainers'
import { SInput, VerticalSpacer } from '../views/components/ViewElements'
import { BaseText } from '../theme/CustomText'
import { BaseButton } from '../views/components/Buttons'
import { Colors } from '../theme/Theme'
import ApiController from '../controllers/ApiController'
import FormState from '../types/FormState'
import VerifyChallenge from './shared/VerifyChallenge'

export default function ResetPassword() {
  const [info, setInfo] = useState({
    token: '',
    newPassword: '',
    newPassword2: '',
    isChecked: false
  })
  const state = FormState()
  const canSubmit = !!info.token &&
    !!info.newPassword &&
    !!info.newPassword2 &&
    info.isChecked

  async function tryResetPassword() {
    if (state.isLoading) {
      return
    }

    if (info.newPassword !== info.newPassword2) {
      state.setError('Passwords do not match')
      return
    }

    state.setLoading()
    const res = await new ApiController(null).auth.resetPassword(info.token, info.newPassword)
    if (res?.success) {
      state.setComplete(res)
    } else {
      state.setError('Sorry, we were not unable to reset your password. ' +
        'Please verify you entered the verification token correctly.')
    }
  }

  return (
    <ThemedAppContainer>
      <FixedWidthVerticalContainer>
        <PublicHeaderWithErrorMessage
          title={'Reset Your Password'}
          subtitle={'Enter the token we sent to your email, and create a new password for yourself.'}
          error={state.error}
        />

        <SuccessOrContent
          success={state.isComplete}
          message={'Password has been reset!'}
          content={
            <>
              <BaseText text={'Token:'} />
              <SInput
                onChange={(v) => setInfo({ ...info, token: v })}
                value={info.token}
                type={'email'}
              />
              <VerticalSpacer size={15} />

              <BaseText text={'New password:'} />
              <SInput
                onChange={(v) => setInfo({ ...info, newPassword: v })}
                value={info.newPassword}
                type={'password'}
              />
              <VerticalSpacer size={15} />

              <BaseText text={'Confirm password:'} />
              <SInput
                onChange={(v) => setInfo({ ...info, newPassword2: v })}
                value={info.newPassword2}
                type={'password'}
              />
              <VerticalSpacer size={15} />

              <VerifyChallenge
                checked={info.isChecked}
                onChange={(value) => setInfo({ ...info, isChecked: value })}
              />
              <VerticalSpacer size={25} />

              <BaseButton
                action={tryResetPassword}
                text={'Submit'}
                background={Colors.RED_00}
                isDisabled={!canSubmit}
              />
            </>
          }
        />
      </FixedWidthVerticalContainer>
    </ThemedAppContainer>
  )
}