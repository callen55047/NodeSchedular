import { RChildren } from '../../../../types/GenericTypes'
import { Colors } from '../../../../theme/Theme'
import { FlexBox } from 'views/components/view/FlexLayouts'
import React from 'react'

export default function ContactDetailsContainer(props: RChildren) {
  return (
    <FlexBox
      vertical
      margin={15}
      style={{
        background: Colors.LIGHT_GREY_01,
        borderRadius: 4,
        padding: 10
      }}
    >{props.children}</FlexBox>
  )
}