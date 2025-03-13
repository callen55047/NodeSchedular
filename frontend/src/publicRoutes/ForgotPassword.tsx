import React, { useState } from 'react'
import { ThemedAppContainer } from '../views/components/view/Containers'
import { FixedWidthVerticalContainer, PublicHeaderWithErrorMessage, SuccessOrContent } from './shared/ViewContainers'
import { SInput, VerticalSpacer } from '../views/components/ViewElements'
import { BaseText } from '../theme/CustomText'
import { BaseButton } from '../views/components/Buttons'
import { Colors } from '../theme/Theme'
import ApiController from '../controllers/ApiController'
import { SCheckBox } from '../views/components/Inputs'
import FormState from '../types/FormState'

export default function ForgotPassword() {
  const [info, setInfo] = useState({ email: '', isChecked: false })
  const state = FormState()

  async function sendForgotPasswordEmail() {
    if (state.isLoading) {
      return
    }

    if (!info.email || !info.isChecked) {
      state.setError('Please enter all fields')
      return
    }

    state.setLoading()
    const res = await new ApiController(null).auth.passwordResetEmail(info.email)
    if (res?.success) {
      state.setComplete(res)
    } else {
      state.setError('Sorry, we were not unable to email you. ' +
        'Please verify you entered an email that is associated with an account.')
    }
  }

  return (
    <ThemedAppContainer>
      <FixedWidthVerticalContainer>
        <PublicHeaderWithErrorMessage
          title={'Forgot Password'}
          subtitle={'We\'re here to help! Please enter your email address that is associated with your account, ' +
            'and we will send you an email to start the password reset process.'}
          error={state.error}
        />

        <SuccessOrContent
          success={state.isComplete}
          message={'Email has been sent!'}
          content={
            <>
              <BaseText text={'Email:'} />
              <SInput
                onChange={(v) => setInfo({ ...info, email: v })}
                value={info.email}
                type={'email'}
              />
              <VerticalSpacer size={15} />

              <SCheckBox
                text={'I am the owner of this account'}
                checked={info.isChecked}
                onChange={(value) => setInfo({ ...info, isChecked: value })}
              />
              <VerticalSpacer size={25} />

              <BaseButton
                action={sendForgotPasswordEmail}
                text={'Submit'}
                background={Colors.RED_00}
              />
            </>
          }
        />
      </FixedWidthVerticalContainer>
    </ThemedAppContainer>
  )
}