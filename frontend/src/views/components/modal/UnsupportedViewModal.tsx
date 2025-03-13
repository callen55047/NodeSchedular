import React, { useContext } from 'react'
import { ModalBase } from '../Modal'
import { FlexBox } from '../view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { VerticalSpacer } from '../ViewElements'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'

export default function UnsupportedViewModal() {
  const { displayManager } = useContext(AppInstance)
  const isActive = displayManager.isMobileView

  if (!isActive) {
    return null
  }

  return (
    <ModalBase isActive={isActive} setIsActive={() => {}} shouldCloseOnEsc={false}>
      <FlexBox justify={'flex-start'} style={{ maxWidth: 300 }}>
        <FlexBox vertical={true} margin={20}>
          <BaseText text={'Attention'} size={18} styles={{ fontWeight: 'bold' }} />
          <VerticalSpacer size={15} />
          <BaseText text={'The artist portal is not currently supported on mobile devices.'} />
        </FlexBox>
      </FlexBox>
    </ModalBase>
  )
}