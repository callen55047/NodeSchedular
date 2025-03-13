import React, { ReactNode } from 'react'
import { FlexBox } from '../view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { DynamicSpacer, Icon } from '../ViewElements'

interface TContainerHeaderProps {
  children: ReactNode,
  heading: string,
  close: () => void
}
const ContainerWithHeaderCloseButton = (props: TContainerHeaderProps) => {
  const { children, heading, close } = props

  return (
    <FlexBox vertical={true} style={{ width: 500 }}>
      <FlexBox style={{
        borderBottom: '1px solid white',
        padding: 15
      }}>
        <BaseText text={heading} size={32} />
        <DynamicSpacer size={1} />
        <Icon
          name={"fa-times"}
          color={'white'}
          margin={0}
          rSize={2.5}
          onClick={close}
        />
      </FlexBox>
      <FlexBox margin={20} vertical={true}>
        {children}
      </FlexBox>
    </FlexBox>
  )
}

interface IInvisibleChildProps {
  children: ReactNode,
  onClick: () => void
}
const InvisibleChildWrapper = (props: IInvisibleChildProps) => {
  const { children, onClick } = props

  return <span
    onClick={onClick}
    style={{ display: 'inherit' }}
  >{children}</span>
}

export {
  ContainerWithHeaderCloseButton,
  InvisibleChildWrapper
}