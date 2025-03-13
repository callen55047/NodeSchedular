import { Colors, FontSizes } from './Theme'
import React from 'react'
import { HorizontalSpacer, Icon } from '../views/components/ViewElements'
import { FlexBox } from '../views/components/view/FlexLayouts'

type TBaseTextProps = {
  text?: string,
  size?: number,
  alignment?: string,
  flex?: number,
  styles?: React.CSSProperties,
  color?: string
}
const BaseText = ({ text, size, alignment, flex, styles, color }: TBaseTextProps) => {
  return <text
    className={'base-text'}
    style={{
      color: color || 'white',
      fontSize: size || FontSizes.f14,
      alignSelf: alignment,
      flex,
      ...styles
    }}>{text}</text>
}

const Text24 = (props: { text: string, color?: string }) => {
  return <BaseText
    text={props.text}
    size={FontSizes.f24}
    alignment={'center'}
    color={props.color}
  />
}

const Text48 = (props: { text: string, underline?: true, styles?: React.CSSProperties }) => {
  return <BaseText
    text={props.text}
    size={FontSizes.f48}
    alignment={'center'}
    styles={{
      textDecoration: props.underline ? 'underline' : undefined,
      ...props.styles
    }}
  />
}

const BaseIconText = ({ icon, text }: { icon: string, text?: string }) => {
  return (
    <FlexBox justify={'flex-start'}>
      <Icon name={icon} margin={0} color={Colors.OFF_WHITE_2} />
      <HorizontalSpacer size={10} />
      <BaseText
        text={text}
        color={Colors.OFF_WHITE_2}
        styles={{ maxWidth: 350 }}
      />
    </FlexBox>
  )
}

interface ITextLinkProps {
  text: string,
  onClick: () => void
}

const TextLink = ({ text, onClick }: ITextLinkProps) => {
  return (
    <span>
      <text
        style={{
          color: Colors.RED_00,
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
      {text}
      </text>
      <Icon
        name={'fa-external-link'}
        margin={'0 0 0 5px'}
        color={Colors.RED_00}
      />
    </span>
  )
}

export {
  BaseText,
  Text24,
  Text48,
  BaseIconText,
  TextLink
}