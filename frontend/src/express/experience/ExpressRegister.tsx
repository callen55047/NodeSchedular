import React from 'react'
import { FlexBox } from '../../views/components/view/FlexLayouts'
import { PublicHeaderWithErrorMessage } from '../../publicRoutes/shared/ViewContainers'
import { BaseButton } from '../../views/components/Buttons'
import { SInput, VerticalSpacer } from '../../views/components/ViewElements'
import { BaseText } from '../../theme/CustomText'
import { ThemedAppContainer } from '../../views/components/view/Containers'

export default function ExpressRegister() {



  return (
    <FlexBox vertical>
      <FlexBox vertical>
        <PublicHeaderWithErrorMessage
          title={'Guest Sign In'}
          subtitle={'To get started, enter your full name and email address'}
          error={''}
        />

        <FlexBox>

        </FlexBox>
      </FlexBox>

      <FlexBox vertical>
        <BaseText text={'First name'}/>
        <SInput onChange={() => {}} type={'text'} value={''}  />
        <VerticalSpacer size={15} />

        <BaseText text={'Last name'}/>
        <SInput onChange={() => {}} type={'text'} value={''}  />
        <VerticalSpacer size={15} />

        <BaseText text={'Email name'}/>
        <SInput onChange={() => {}} type={'text'} value={''}  />
        <VerticalSpacer size={15} />
      </FlexBox>

      <BaseButton action={() => {}} text={'Continue'} />
    </FlexBox>
  )
}