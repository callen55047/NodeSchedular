import React, { useState } from 'react'
import { ThemedAppContainer } from '../views/components/view/Containers'
import { FixedWidthVerticalContainer, PublicHeaderWithErrorMessage, SuccessOrContent } from './shared/ViewContainers'
import { SInput, SInputTextArea, VerticalSpacer } from '../views/components/ViewElements'
import { BaseText } from '../theme/CustomText'
import { ApiContract } from '../contracts/ApiContract'
import ApiController from '../controllers/ApiController'
import { BaseButton } from '../views/components/Buttons'
import { Colors } from '../theme/Theme'
import FormState from '../types/FormState'
import VerifyChallenge from './shared/VerifyChallenge'

interface IDeleteAccount extends ApiContract.Props.DeleteAccount {
  verify: boolean
}
export default function DeleteAccount() {
  const [info, setInfo] = useState({} as IDeleteAccount)
  const state = FormState()

  const canSubmit = info.verify &&
    !!info.message &&
    !!info.email &&
    !!info.password

  async function confirmDelete() {
    if (state.isLoading) {
      return
    }

    state.setLoading()
    const res = await new ApiController(null).auth.deleteAccount(info)
    if (res?.success) {
      state.setComplete(res)
    } else {
      state.setError(
        'Error, unable to delete account. ' +
        'Verify all your information is entered correctly. ' +
        'Please contact support if this issue persists'
      )
    }
  }

  return (
    <ThemedAppContainer>
      <FixedWidthVerticalContainer>
        <PublicHeaderWithErrorMessage
          title={"Delete Account"}
          subtitle={"We're sad to see you go. Please enter your email, password " +
            "and the reason you are deleting your account."}
          error={state.error}
        />

        <SuccessOrContent
          success={state.isComplete}
          message={'Account has been deleted'}
          content={
            <>
              <BaseText text={'Email:'} />
              <SInput
                onChange={(v) => setInfo({...info, email: v})}
                value={info.email}
                type={'text'}
              />
              <VerticalSpacer size={15} />

              <BaseText text={'Password:'} />
              <SInput
                onChange={(v) => setInfo({...info, password: v})}
                value={info.password}
                type={'password'}
              />
              <VerticalSpacer size={15} />

              <BaseText text={'Reason for deleting:'} />
              <SInputTextArea
                onChange={(v) => setInfo({...info, message: v})}
                value={info.message}
                minHeight={200}
              />
              <VerticalSpacer size={15} />

              <VerifyChallenge
                checked={info.verify}
                onChange={(value) => setInfo({ ...info, verify: value })}
              />
              <VerticalSpacer size={25} />

              <BaseButton
                action={confirmDelete}
                text={'Confirm Delete'}
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