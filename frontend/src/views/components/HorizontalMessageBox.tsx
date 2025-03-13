import React from 'react'
import { FlexBox } from './view/FlexLayouts'
import { BorderRadius, Colors } from '../../theme/Theme'
import { BaseText } from '../../theme/CustomText'

interface THorizontalInfoBoxProps {
  text: string,
  background: string
}

const HorizontalMessageBox = (props: THorizontalInfoBoxProps) => {
  const { text, background } = props

  return <FlexBox style={{
    border: `1px solid grey`,
    background,
    borderRadius: BorderRadius.r4,
    margin: '10px 0',
    padding: '8px 16px'
  }} vertical={true} wrap={"wrap"}>
    <BaseText text={text} />
  </FlexBox>
}

const ErrorTextBlock = (props: { text: string }) => {
  return <HorizontalMessageBox
    text={props.text}
    background={Colors.DARK_RED}
  />
}

const WarningTextBlock = (props: { text: string }) => {
  return <HorizontalMessageBox
    text={props.text}
    background={'rgb(110,90,0)'}
  />
}

const SuccessTextBlock = (props: { text: string }) => {
  return <HorizontalMessageBox
    text={props.text}
    background={'rgb(8,54,0)'}
  />
}

interface IMessageBoxType {
  style: 'success' | 'warning' | 'error' | 'none',
  text: string
}

const MessageBoxSwitch = (props: IMessageBoxType) => {
  switch (props.style) {
    case 'success':
      return SuccessTextBlock(props)
    case 'warning':
      return WarningTextBlock(props)
    case 'error':
      return ErrorTextBlock(props)
    default:
      return null
  }
}

export {
  ErrorTextBlock,
  WarningTextBlock,
  SuccessTextBlock,
  IMessageBoxType,
  MessageBoxSwitch
}