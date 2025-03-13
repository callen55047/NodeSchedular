import React, { MouseEventHandler } from 'react'
import { HorizontalSpacer, Icon } from './ViewElements'
import { BorderRadius, Colors, FontSizes } from '../../theme/Theme'
import { BaseText } from '../../theme/CustomText'

type TButtonTheme = 'PRIMARY' | 'SECONDARY' | 'DANGER' | 'SUCCESS' | 'CLEAR'

function getThemedButtonColor(theme: TButtonTheme): string {
  switch (theme) {
    case 'PRIMARY':
      return Colors.BLUE_00
    case 'SECONDARY':
      return Colors.LIGHT_GREY_00
    case 'DANGER':
      return Colors.DANGER_RED
    case 'SUCCESS':
      return Colors.SUCCESS_GREEN
    case 'CLEAR':
      return 'transparent'
  }
}

function getThemedButtonTextColor(theme: TButtonTheme): string {
  switch (theme) {
    case 'PRIMARY':
      return Colors.DARK_BLUE
    case 'SECONDARY':
      return Colors.DARK_GREY
    case 'DANGER':
      return Colors.DARK_RED
    case 'SUCCESS':
      return Colors.GREEN
    case 'CLEAR':
      return 'white'
  }
}

type TBaseButtonProps = {
  action: () => void,
  text: string,
  icon?: string,
  background?: string,
  iconSize?: number,
  color?: string,
  styles?: React.CSSProperties,
  padding?: string,
  isDisabled?: boolean
}
const BaseButton = (props: TBaseButtonProps) => {
  const { text, icon, iconSize, background, color, action, styles, padding, isDisabled } = props
  return <button
    className={'simple-hover'}
    style={{
      borderRadius: BorderRadius.r4,
      border: 'none',
      cursor: isDisabled ? undefined : 'pointer',
      background: isDisabled ? 'transparent' : background || Colors.DARK_GREY,
      ...styles
    }}
    onClick={action}
    disabled={isDisabled}
  >
    <div style={{ margin: padding || '5px 10px' }}>
      {icon &&
        <Icon
          name={icon}
          color={color || 'white'}
          margin={5}
          rSize={iconSize || 1}
        />}
      <text style={{
        fontSize: iconSize ? `${iconSize}rem` : FontSizes.BUTTON_LARGE,
        color: color || 'white',
        alignSelf: 'center'
      }}>
        {text}
      </text>
    </div>
  </button>
}

type TFlexButtonProps = {
  text: string,
  icon?: string,
  action: () => void,
  background: string
}
const FlexButton = (props: TFlexButtonProps) => {
  const { text, icon, action, background } = props
  return <BaseButton
    text={text}
    icon={icon}
    styles={{ flex: 1 }}
    padding={'10px 10px'}
    action={action}
    background={background}
    iconSize={1.5}
  />
}

type TYesNoButtonProps = {
  action: () => void
}
const YesButton = ({ action }: TYesNoButtonProps) => {
  return <FlexButton
    text={'Yes'}
    icon={'fa-thumbs-o-up'}
    action={action}
    background={Colors.GREEN}
  />
}
const NoButton = ({ action }: TYesNoButtonProps) => {
  return <FlexButton
    text={'No'}
    icon={'fa-ban'}
    action={action}
    background={Colors.RED_00}
  />
}

type TSmallIconButtonProps = {
  icon: string,
  action?: () => void,
  background: string,
  tooltip?: string
}
const SmallIconButton = (props: TSmallIconButtonProps) => {
  const { background, icon, action, tooltip } = props

  return (
    <span
      style={{
        padding: 5,
        background: !!action ? background : Colors.LIGHT_GREY_00,
        borderRadius: BorderRadius.r10,
        cursor: !!action ? 'pointer' : undefined,
        margin: 2
      }}
      onClick={action}
      title={tooltip}
    >
            <Icon name={icon} margin={'2px 5px'} />
        </span>
  )
}

type TSimpleButtonProps = {
  theme: TButtonTheme,
  text: string,
  action: () => void,
  isLoading?: boolean,
  isDisabled?: boolean,
  slim?: boolean,
  icon?: string,
  collapsable?: boolean
}
const SimpleButton = (props: TSimpleButtonProps) => {
  const {
    theme,
    action,
    text,
    isLoading,
    isDisabled,
    slim,
    icon,
    collapsable
  } = props

  const color = getThemedButtonColor(theme)
  const textColor = getThemedButtonTextColor(theme)
  const padding = slim ? '5px 10px' : '10px 24px'
  const divider = !!icon && !!text

  return (
    <button
      className={`simple-hover ${collapsable ? 'tablet-text-hide' : ''}`}
      style={{
        background: isDisabled ? Colors.LIGHT_GREY_00 : color,
        borderRadius: BorderRadius.r4,
        border: '1px solid black',
        cursor: 'pointer',
        padding,
        maxHeight: slim ? 30 : 40,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'space-around'
      }}
      onClick={action}
      disabled={isLoading || isDisabled}
    >
      {isLoading ?
        <Icon
          name={'fa-gear fa-spin'}
          color={'white'}
          margin={0}
        />
        :
        <>
          <BaseText
            text={text}
            color={isDisabled ? Colors.DARK_GREY : textColor}
            size={16}
            styles={{
              fontWeight: 'bold'
            }}
            alignment={'center'}
          />
          {divider && <HorizontalSpacer size={5} />}
          {icon && <Icon name={icon} margin={0} color={textColor} />}
        </>

      }
    </button>
  )
}

type TCircleButtonProps = {
  icon: string,
  color: string,
  size?: number,
  onClick: () => void
}
const CircleButton = ({ icon, color, size, onClick }: TCircleButtonProps) => {
  const buttonSize = size || 40

  return (
    <button
      style={{
        border: 'none',
        height: buttonSize,
        width: buttonSize,
        borderRadius: buttonSize,
        background: color,
        alignSelf: 'center',
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      <Icon
        name={icon}
        rSize={1.5}
        margin={0}
      />
    </button>
  )
}

const TextButton = (props: TBaseButtonProps) => {
  const { text, action, color } = props

  return (
    <button
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer'
      }}
      onClick={action}
    >
      <BaseText text={text} color={color || Colors.BLUE_00} />
    </button>
  )
}

export {
  BaseButton,
  FlexButton,
  YesButton,
  NoButton,
  SmallIconButton,
  SimpleButton,
  CircleButton,
  TextButton
}