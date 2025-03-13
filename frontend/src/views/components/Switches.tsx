import React from 'react'
import { FlexBox } from './view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { BorderRadius } from '../../theme/Theme'
import { TextButton } from './Buttons'

type TMultiLabelSwitch = {
  options: string[],
  current: string,
  onSelect: (name: string) => void
}
const MultiLabelSwitch = (props: TMultiLabelSwitch) => {
  const { options, current, onSelect } = props

  return (
    <FlexBox wrap={"wrap"}>
      {options.map((name) => {
        return (
          <SwitchButton
            text={name}
            isActive={name === current}
            action={() => onSelect(name)}
          />
        )
      })}
    </FlexBox>
  )
}

const MultiLabelTextSwitch = (props: TMultiLabelSwitch) => {
  const { options, current, onSelect } = props

  return (
    <FlexBox wrap={"wrap"}>
      {options.map((name) => {
        return (
          <SwitchTextButton
            text={name}
            isActive={name === current}
            action={() => onSelect(name)}
          />
        )
      })}
    </FlexBox>
  )
}

type TSwitchButtonProps = {
  isActive: boolean,
  action: () => void,
  text: string
}
const SwitchButton = (props: TSwitchButtonProps) => {
  const { isActive, action, text } = props
  const classname = isActive ? 'switch-btn active' : 'switch-btn inactive'

  return (
    <button
      className={classname}
      style={{
        background: "#2b2b2b",
        borderRadius: BorderRadius.r4,
        opacity: isActive ? 1.0 : 0.75,
        fontPalette: "white",
        border: 0,
        minWidth: 150,
        height: 30,
        margin: 4,
        cursor: isActive ? 'unset' : 'pointer',
        boxShadow: isActive ? '0 0 2px 1px white' : '0 0 2px 1px #2b2b2b',
        transition: 'all 0.5s ease-in-out',
      }}
      onClick={action}
    >
      <BaseText text={text} styles={{ margin: '0 4px', fontWeight: 'bold' }} />
    </button>
  )
}

const SwitchTextButton = (props: TSwitchButtonProps) => {
  const { isActive, action, text } = props
  const classname = isActive ? 'switch-btn active' : 'switch-btn inactive'

  return (
    <button
      className={classname}
      style={{
        background: 'transparent',
        opacity: isActive ? 1.0 : 0.75,
        fontPalette: "white",
        minWidth: 75,
        border: 0,
        height: 30,
        borderBottom: `1px solid ${isActive ? 'white' : 'transparent'}`,
        margin: 4,
        cursor: isActive ? 'unset' : 'pointer',
        transition: 'all 0.5s ease-in-out',
      }}
      onClick={action}
    >
      <BaseText
        text={text}
        styles={{
          margin: '0 4px',
          fontWeight: isActive ? 'bold' : 'unset'
      }}
      />
    </button>
  )
}

export {
  MultiLabelSwitch,
  MultiLabelTextSwitch,
  TMultiLabelSwitch
}