import { RChildren } from '../../../types/GenericTypes'
import React from 'react'
import { DynamicSpacer } from '../ViewElements'
import { toast } from 'react-toastify'

// defaults to conversation view style
// 1:3 split of left:right space
// with minimum size on left side of 250
type TVerticalSplitViewProps = RChildren & {
  flexLeft?: number,
  flexRight?: number,
  leftMinWidth?: number
}
const VerticalSplitColumnView = (props: TVerticalSplitViewProps) => {
  const { children, flexLeft, flexRight, leftMinWidth } = props
  return <div style={{
    display: 'flex',
    height: '100%',
    overflow: 'auto'
  }}>
    <div style={{
      flex: flexLeft || 1,
      minWidth: leftMinWidth || 250,
      display: 'flex',
      flexDirection: 'column',
      marginRight: 15
    }}>
      {/*@ts-ignore*/}
      {children[0]}
    </div>
    <div style={{
      flex: flexRight || 4,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 10,
      overflow: 'auto'
    }}>
      {/*@ts-ignore*/}
      {children[1]}
    </div>
  </div>
}

type TFlexBoxProps = RChildren & {
  vertical?: boolean,
  justify?: string,
  wrap?: 'wrap'
  margin?: number | string,
  flexBias?: number,
  style?: React.CSSProperties,
  onClick?: () => void,
}
const FlexBox = (props: TFlexBoxProps) => {
  const { children, vertical, justify, margin, style, wrap, flexBias, onClick } = props
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        justifyContent: justify || 'space-around',
        flexWrap: wrap,
        margin,
        flex: flexBias,
        cursor: !!onClick ? 'pointer' : undefined,
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const SuspendBox = (props: RChildren) => {
  return (
    <FlexBox vertical={true}>
      <FlexBox>
        {props.children}
      </FlexBox>
    </FlexBox>
  )
}

const SuspendFillBox = (props: RChildren) => {
  return (
    <FlexBox vertical={true} flexBias={1}>
      <FlexBox flexBias={1}>
        {props.children}
      </FlexBox>
    </FlexBox>
  )
}

// TODO: add vertical support
type TFlexBiasContainerProps = RChildren & {
  flexRatio: number
}
const FlexBiasContainer = ({ children, flexRatio }: TFlexBiasContainerProps) => {
  return (
    <FlexBox>
      <DynamicSpacer size={1} />
      <div style={{ flex: flexRatio }}>
        {children}
      </div>
      <DynamicSpacer size={1} />
    </FlexBox>
  )
}

export {
  VerticalSplitColumnView,
  FlexBox,
  FlexBiasContainer,
  SuspendBox,
  SuspendFillBox
}