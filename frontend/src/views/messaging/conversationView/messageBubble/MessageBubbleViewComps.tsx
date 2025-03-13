import React, { ReactNode } from 'react'
import { FlexBox } from '../../../components/view/FlexLayouts'
import { BorderRadius, Colors } from '../../../../theme/Theme'
import { BaseText } from '../../../../theme/CustomText'
import { DividerLine, Icon, VerticalSpacer } from '../../../components/ViewElements'

interface IMBItemContainerProps {
  isSender: boolean,
  children: ReactNode,
  width?: number
}
const MBItemContainer = (props: IMBItemContainerProps) => {
  const { isSender, children, width } = props

  return <FlexBox justify={isSender ? 'flex-end' : 'flex-start'}>
    <FlexBox vertical={true} style={{
      background: isSender ? Colors.BLUE_00 : Colors.LIGHT_GREY_00,
      borderRadius: BorderRadius.r10,
      padding: 8,
      width,
      maxWidth: '500px',
      margin: '10px 20px',
    }}>
      {children}
    </FlexBox>
  </FlexBox>
}

interface IMBEventContainerProps extends IMBItemContainerProps {
  title: string,
  icon: string
}
const MBEventContainer = (props: IMBEventContainerProps) => {
  const { isSender, children, title, icon } = props
  return (
    <MBItemContainer isSender={isSender} width={300}>
      <FlexBox justify={'space-between'}>
        <BaseText
          text={title}
          size={20}
          alignment={'center'}
          styles={{fontWeight: 'bold'}}
        />
        <Icon
          name={icon}
          rSize={1.5}
          margin={0}
          color={'white'}
        />
      </FlexBox>
      <DividerLine />
      <VerticalSpacer size={5} />
      <FlexBox vertical={true}>
        {children}
      </FlexBox>
    </MBItemContainer>
  )
}

const MBBodyText = ({text, bold}: {text: string, bold?: boolean}) => {
  return <BaseText
    text={text}
    color={Colors.OFF_WHITE_2}
    styles={{fontWeight: bold ? 'bold' : undefined}}
  />
}

export {
  MBItemContainer,
  MBEventContainer,
  MBBodyText
}