import React, { useContext } from 'react'
import { RChildren } from '../../types/GenericTypes'
import { ProfileContext } from './ProfileContext'
import { SInput, SInputTextArea } from '../components/ViewElements'

type TLabelAndFieldProps = RChildren & {
  name: string
}
const LabelAndFieldContainer = ({ name, children }: TLabelAndFieldProps) => {
  return <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '45%',
    margin: '5px 10px'
  }}>
    <text style={{
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
      display: 'block',
      marginBottom: 5
    }}>{name}</text>
    {children}
  </div>
}

type TProfileInputFieldProps = {
  name: string,
  minHeight?: number,
  value?: string | number,
  onChange: (value: any) => void,
  textArea?: boolean,
  type?: string,
  isReadOnly?: boolean
}
const ProfileInputField = (props: TProfileInputFieldProps) => {
  const { name, minHeight, onChange, textArea, value, type, isReadOnly } = props
  const { isInEditMode } = useContext(ProfileContext)

  return <LabelAndFieldContainer name={name} key={`input-${name}`}>
    {textArea ?
      <SInputTextArea
        isDisabled={isReadOnly || !isInEditMode}
        minHeight={minHeight}
        value={value}
        onChange={onChange}
      />
      :
      <SInput
        type={type}
        isDisabled={isReadOnly || !isInEditMode}
        value={value}
        minHeight={minHeight}
        onChange={onChange}
      />
    }
  </LabelAndFieldContainer>
}

export {
  LabelAndFieldContainer,
  ProfileInputField
}