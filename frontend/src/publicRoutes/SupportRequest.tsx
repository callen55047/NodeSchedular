import React, { useState } from 'react'
import { ThemedAppContainer } from '../views/components/view/Containers'
import { FixedWidthVerticalContainer, PublicHeaderWithErrorMessage, SuccessOrContent } from './shared/ViewContainers'
import { ApiContract } from '../contracts/ApiContract'
import { SInput, SInputTextArea, VerticalSpacer } from '../views/components/ViewElements'
import { BaseText } from '../theme/CustomText'
import { BaseButton } from '../views/components/Buttons'
import { Colors } from '../theme/Theme'
import ApiController from '../controllers/ApiController'
import FormState from '../types/FormState'
import VerifyChallenge from './shared/VerifyChallenge'

interface ISupportInfo extends ApiContract.Props.SupportRequest {
  verified: boolean
}
export default function SupportRequest() {
  const [info, setInfo] = useState({} as ISupportInfo)
  const state = FormState()
  const canSubmit = info.verified &&
    !!info.subject &&
    !!info.email &&
    !!info.message

  async function createSupportRequest() {
    if (state.isLoading) {
      return
    }

    state.setLoading()
    const res = await new ApiController(null).auth.supportRequest(info)
    if (res?.success) {
      state.setComplete(res)
    } else {
      state.setError('Sorry, we were not able to create support request. ' +
        'Please verify you entered an email that is associated with an account.')
    }
  }

  return (
    <ThemedAppContainer>
      <FixedWidthVerticalContainer>
        <PublicHeaderWithErrorMessage
          title={"Send Support Request"}
          subtitle={"We're here to help! Please enter your name, email address that is associated with your account, " +
            "and as much information as possible about the issue you are facing. Please give specific details " +
            "where ever possible."}
          error={state.error}
        />

        <SuccessOrContent
          success={state.isComplete}
          message={"Support request created! We will review the information and email you " +
            "back as soon as possible."}
          content={
            <>
              <BaseText text={'Email:'} />
              <SInput
                onChange={(v) => setInfo({...info, email: v})}
                value={info.email}
                type={'email'}
              />
              <VerticalSpacer size={15} />

              <BaseText text={'Subject:'} />
              <SInput
                onChange={(v) => setInfo({...info, subject: v})}
                value={info.subject}
                type={'text'}
              />
              <VerticalSpacer size={15} />

              <BaseText text={'Message:'} />
              <SInputTextArea
                onChange={(v) => setInfo({...info, message: v})}
                value={info.message}
                minHeight={200}
              />
              <VerticalSpacer size={15} />

              <VerifyChallenge
                checked={info.verified}
                onChange={(value) => setInfo({ ...info, verified: value })}
              />

              <VerticalSpacer size={25} />

              <BaseButton
                action={createSupportRequest}
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