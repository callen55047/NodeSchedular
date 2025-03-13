import React from 'react'
import { FlexBox } from '../components/view/FlexLayouts'
import { PlaceholderSign } from '../components/ViewElements'

export default function DisputeHistory() {

  return (
    <FlexBox vertical={true} style={{ height: '100%', overflow: 'auto' }}>
      <PlaceholderSign />
    </FlexBox>
  )
}