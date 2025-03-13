import React, { HTMLInputTypeAttribute, MouseEventHandler } from 'react'
import { Colors } from '../../theme/Theme'
import { FlexBox } from './view/FlexLayouts'
import { IAccount } from '../../internal/models/Account'
import { BaseText } from '../../theme/CustomText'
import { PORTAL_APP_VERSION } from '../../internal/Versioning'

type SizeProp = {
  size: number
}

const Spacer = ({ size }: SizeProp) => {
  return <div style={{
    display: 'inline',
    flex: size
  }} />
}

const HorizontalSpacer = ({ size }: SizeProp) => {
  return <div style={{
    display: 'inline',
    width: size
  }} />
}

const DynamicSpacer = ({ size }: SizeProp) => {
  return <div style={{ flex: size }} />
}

const VerticalSpacer = ({ size }: SizeProp) => {
  return <div style={{
    height: size
  }} />
}

type IconProps = {
  name: string,
  color?: string,
  rSize?: number,
  margin?: number | string,
  onClick?: MouseEventHandler,
  style?: React.CSSProperties,
  title?: string
}
const Icon = ({ name, color, rSize, margin, onClick, style, title }: IconProps) => {
  const size = `${rSize || 1}rem`
  const isSpinning = name.includes('fa-spin')

  return <i
    title={title}
    className={`fa ${name}`}
    onClick={onClick}
    style={{
      alignSelf: 'center',
      color: color || 'white',
      margin: margin ?? 15,
      fontSize: size,
      cursor: !!onClick ? 'pointer' : undefined,
      minWidth: isSpinning ? undefined : size,
      ...style
    }}
  />
}

type TSImageProps = {
  margin?: number,
  src: any,
  onClick?: MouseEventHandler
}
const SImage = (props: TSImageProps) => {
  const { margin, src, onClick } = props
  return <img
    src={src}
    style={{ objectFit: 'contain', borderRadius: 4, margin }}
    onClick={onClick}
    alt={'alt'}
  />
}

type TPlaceholderProps = {
  height?: number,
  text?: string,
  icon?: string
}
const PlaceholderSign = (props: TPlaceholderProps) => {
  const { height, text, icon } = props
  return <div style={{ display: 'flex', justifyContent: 'space-around', margin: 25 }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: height || 100
      }}>
      <Icon name={icon || 'fa-file'} rSize={5} color={'white'} />
      <h3 style={{ color: 'white' }}>{text || 'Under Construction'}</h3>
    </div>
  </div>
}

type SInputType = {
  isDisabled?: boolean,
  value?: string | number,
  minHeight?: number,
  onChange: (value: any) => void,
  type?: HTMLInputTypeAttribute,
  placeholder?: string,
  maxWidth?: number
}
const SInput = (props: SInputType) => {
  const { isDisabled, value, minHeight, onChange, type, placeholder, maxWidth } = props
  return <input
    disabled={isDisabled}
    placeholder={placeholder}
    value={value}
    type={type}
    style={{
      height: 30,
      borderRadius: 4,
      backgroundColor: isDisabled ? Colors.DARK_GREY : Colors.LIGHT_GREY_01,
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
      minHeight,
      border: 'none',
      padding: '0 5px',
      maxWidth
    }}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
  />
}

const SInputTextArea = (props: SInputType) => {
  const { isDisabled, value, minHeight, onChange, placeholder } = props
  return <textarea
    disabled={isDisabled}
    placeholder={placeholder}
    value={value}
    style={{
      height: 30,
      borderRadius: 4,
      backgroundColor: isDisabled ? Colors.DARK_GREY : Colors.LIGHT_GREY_01,
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
      minHeight,
      border: 'none',
      padding: 5,
      resize: 'none'
    }}
    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
  />
}

const StatusLight = ({ color, alignSelf }: { color: string, alignSelf?: string }) => {
  return <span style={{
    width: 10,
    height: 10,
    borderRadius: 10,
    background: color,
    marginLeft: 10,
    alignSelf
  }} />
}

const AppVersionBottomRight = () => {
  return (
    <BaseText
      text={PORTAL_APP_VERSION}
      styles={{
        position: 'absolute',
        right: 10,
        bottom: 10
      }}
    />
  )
}

const DividerLine = ({ vertical }: { vertical?: boolean }) => {
  return (
    <div style={{
      display: vertical ? 'inline' : 'block',
      width: vertical ? 1 : undefined,
      height: vertical ? undefined : 1,
      background: Colors.OFF_WHITE,
      margin: '5px 0'
    }} />
  )
}

const DividerWithTitle = ({ name }: { name: string }) => {
  return (
    <FlexBox
      margin={'15px 0'}
      vertical={true}
    >
      <BaseText
        text={name}
        color={Colors.LIGHT_GREY_00}
      />
      <DividerLine />
    </FlexBox>
  )
}

const VerticalContentDivider = (props: { fullWidth?: boolean }) => {
  const { fullWidth } = props
  return (
    <div style={{
      display: 'block',
      height: 1,
      background: Colors.LIGHT_GREY_01,
      margin: fullWidth ? '15px 0' : 15
    }} />
  )
}

export {
  Spacer,
  HorizontalSpacer,
  DynamicSpacer,
  VerticalSpacer,
  Icon,
  SImage,
  PlaceholderSign,
  SInput,
  StatusLight,
  SInputTextArea,
  AppVersionBottomRight,
  DividerLine,
  DividerWithTitle,
  VerticalContentDivider
}