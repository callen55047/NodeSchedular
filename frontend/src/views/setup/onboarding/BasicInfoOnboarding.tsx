import React, { useContext, useState } from 'react'
import SetupContainerView from '../SetupContainerView'
import { LabeledInput } from '../../components/Inputs'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { VerticalSpacer } from '../../components/ViewElements'
import { SimpleButton } from '../../components/Buttons'
import { SequenceContext } from '../../../appEntry/sequenceController/SequenceContext'
import { getDiff } from '../../../internal/ObjectHelpers'
import { toast } from 'react-toastify'

export default function BasicInfoOnboarding() {
  const { currentUser, api, runBlocking, logger } = useContext(AppInstance)
  const { goToStep } = useContext(SequenceContext)
  const [localUser, setLocalUser] = useState({ ...currentUser! })

  const isComplete = localUser.first_name && localUser.last_name
    && localUser.phone_number

  function updateField(key: string, value: string) {
    setLocalUser({ ...localUser, [key]: value })
  }

  function completeStep() {
    runBlocking(async () => {
      const hasChanges = getDiff(currentUser, localUser)
      if (hasChanges) {
        const res = await api.account.updateProfile({
          first_name: localUser.first_name,
          last_name: localUser.last_name,
          phone_number: localUser.phone_number,
        })
        if (!res) {
          await logger.error('[BasicInfoOnboarding] Failed to update profile')
          toast.error('Failed to update profile')
          return
        }
      }
      goToStep('ADDRESS')
    })
  }

  return (
    <SetupContainerView title={'Basic Info'} current={2}>
      <LabeledInput
        label={'First name'}
        value={localUser.first_name}
        onChange={(v) => updateField('first_name', v)}
      />
      <LabeledInput
        label={'Last name'}
        value={localUser.last_name}
        onChange={(v) => updateField('last_name', v)}
      />
      <LabeledInput
        label={'Phone number'}
        value={localUser.phone_number}
        onChange={(v) => updateField('phone_number', v)}
      />
      <VerticalSpacer size={15} />
      <SimpleButton
        theme={'SUCCESS'}
        text={'Continue'}
        action={completeStep}
        isDisabled={!isComplete}
      />
    </SetupContainerView>
  )
}