import React, { useContext, useEffect, useState } from 'react'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import SetupContainerView from '../SetupContainerView'
import { SequenceContext } from '../../../appEntry/sequenceController/SequenceContext'
import { FlexBox } from '../../components/view/FlexLayouts'
import { LabeledInput } from '../../components/Inputs'
import { IAddress } from '../../../internal/models/shared/Address'
import GoogleMaps from '../../../internal/plugins/GoogleMaps'
import { toast } from 'react-toastify'
import { VerticalSpacer } from '../../components/ViewElements'
import { BaseText } from '../../../theme/CustomText'
import { SimpleButton } from '../../components/Buttons'
import { Colors } from '../../../theme/Theme'
import { getDiff } from '../../../internal/ObjectHelpers'

let _addressTask: number | undefined

export default function AddressOnboarding() {
  const { currentUser, api, runBlocking, logger } = useContext(AppInstance)
  const { goToStep } = useContext(SequenceContext)
  const [localUser, setLocalUser] = useState({ ...currentUser! })

  const verifiedAddress = !!localUser.address?.coordinates

  useEffect(() => {
    return () => {
      clearTimeout(_addressTask)
    }
  }, [])

  function updateAddressField(field: string, value: string) {
    const updatedAddress = { ...localUser.address, [field]: value, coordinates: null } as IAddress
    setLocalUser({ ...localUser, address: updatedAddress })

    if (updatedAddress.street && updatedAddress.city) {
      clearTimeout(_addressTask)
      _addressTask = setTimeout(async () => {
        const res = await GoogleMaps.getCoordinatesFor(updatedAddress)
        if (typeof res === 'string') {
          toast.error(`[Address validation] ${res}`)
          await logger.error(`[AddressOnboarding] ${res}`)
        } else {
          setLocalUser({ ...localUser, address: { ...updatedAddress, coordinates: res } as IAddress })
        }
      }, 1000)
    }
  }

  function completeStep() {
    runBlocking(async () => {
      const hasChanges = getDiff(currentUser, localUser)
      if (hasChanges) {
        const res = await api.account.updateProfile({
          address: localUser.address!
        })
        if (!res) {
          await logger.error('[AddressOnboarding] Failed to update profile address')
          toast.error('Failed to update profile address')
          return
        }
      }
      goToStep('MEDIA')
    })
  }

  return (
    <SetupContainerView title={'Shop Address'} current={3}>
      <LabeledInput
        label={'Street'}
        value={localUser.address?.street || ''}
        onChange={(value) => updateAddressField('street', value)}
      />
      <FlexBox>
        <LabeledInput
          label={'City'}
          value={localUser.address?.city || ''}
          onChange={(value) => updateAddressField('city', value)}
        />
        <LabeledInput
          label={'Province'}
          value={localUser.address?.province_state || ''}
          onChange={(value) => updateAddressField('province_state', value)}
        />
      </FlexBox>
      <FlexBox>
        <LabeledInput
          label={'Postal code'}
          value={localUser.address?.postal_zip || ''}
          onChange={(value) => updateAddressField('postal_zip', value)}
        />
        <LabeledInput
          label={'Country'}
          value={localUser.address?.country || ''}
          onChange={(value) => updateAddressField('country', value)}
        />
      </FlexBox>
      <VerticalSpacer size={15} />

      {verifiedAddress ?
        <FlexBox vertical>
          <BaseText
            text={'Great spot you got there!'}
            color={Colors.LIGHT_GREY_00}
          />
          <VerticalSpacer size={10} />
          <SimpleButton
            theme={"SUCCESS"}
            text={"Continue"}
            action={completeStep}
          />
        </FlexBox>
        :
        <BaseText
          text={'Please enter a valid Canadian address'}
          color={Colors.LIGHT_GREY_00}
        />
      }
    </SetupContainerView>
  )
}