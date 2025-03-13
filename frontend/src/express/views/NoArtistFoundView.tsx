import { FlexBox } from '../../views/components/view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import React from 'react'

export default function NoArtistFoundView() {

  return (
    <FlexBox>
      <BaseText text={'No artist found. Please try again'} />
    </FlexBox>
  )
}