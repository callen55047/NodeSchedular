import React, { useContext } from 'react'
import { FlexBox } from './view/FlexLayouts'
import { HorizontalSpacer } from './ViewElements'
import { BaseText } from '../../theme/CustomText'
import { BorderRadius, Colors, FontSizes } from '../../theme/Theme'
import TimeSlotManager, { IButtonTimeSlot } from '../../internal/dateAndTime/TimeSlotManager'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { ISession } from '../../internal/models/Session'
import moment from 'moment'
import FromUtcDate from '../../internal/DateAndTime'

const LABELED_INPUT_STYLE_BASE = {
  padding: 10,
  border: '2px solid black',
  borderRadius: 4,
  fontSize: 16,
  color: 'gray'
}

type TCheckBoxProps = {
  text: string,
  checked: boolean,
  onChange: (newValue: boolean) => void
}
const SCheckBox = (props: TCheckBoxProps) => {
  const { text, onChange, checked } = props

  return (
    <FlexBox
      justify={'space-between'}
      margin={5}
    >
      <BaseText text={text} size={18} alignment={'center'} />
      <HorizontalSpacer size={10} />
      <input
        checked={checked}
        type={'checkbox'}
        style={{
          width: 20,
          height: 20
        }}
        onChange={(e) => onChange(e.target.checked)}
      />
    </FlexBox>
  )
}

type TLabeledInputProps = {
  label: string,
  onChange?: (value: any) => void,
  value: string | number,
  minHeight?: number,
  minWidth?: number,
  type?: string
}
const LabeledInput = (props: TLabeledInputProps) => {
  const { label, onChange, value, minHeight, minWidth, type } = props
  return (
    <FlexBox vertical={true}>
      <BaseText text={label} styles={{ margin: '4px 0' }} />
      <input
        type={type ?? 'text'}
        value={value}
        onChange={!!onChange ?
          (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)
          :
          undefined
        }
        style={{
          ...LABELED_INPUT_STYLE_BASE,
          minHeight,
          minWidth,
          cursor: !!onChange ? 'pointer' : undefined
        }}
        disabled={onChange === undefined}
      />
    </FlexBox>
  )
}

const LabeledTextAreaInput = (props: TLabeledInputProps) => {
  const { label, onChange, value, minHeight, type } = props
  return (
    <FlexBox vertical={true}>
      <BaseText text={label} styles={{ margin: '4px 0' }} />
      <textarea
        value={value}
        onChange={!!onChange ? (e) => onChange(e.target.value) : undefined}
        style={{
          ...LABELED_INPUT_STYLE_BASE,
          minHeight,
          cursor: !!onChange ? 'pointer' : undefined
        }}
        disabled={onChange === undefined}
      />
    </FlexBox>
  )
}

type TStateLabeledInputProps<T> = {
  state: T,
  setState?: React.Dispatch<React.SetStateAction<T>>,
  property: string,
  type?: React.HTMLInputTypeAttribute,
  minHeight?: number
}
const StateLabeledInput = <T, >(props: TStateLabeledInputProps<T>) => {
  const { state, property, setState, type, minHeight } = props

  const title = property
  const value = (state as any)[property]

  function setProperty(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value
    setState!({ ...state, [property]: value })
  }

  return (
    <FlexBox vertical={true}>
      <BaseText text={title} styles={{ margin: '4px 0' }} />
      <input
        type={type ?? 'text'}
        value={value}
        onChange={!!setState ? setProperty : undefined}
        style={{
          ...LABELED_INPUT_STYLE_BASE,
          minHeight,
          cursor: !!setState ? 'pointer' : undefined
        }}
        disabled={setState === undefined}
      />
    </FlexBox>
  )
}

type TDropDownLabeledInputProps = TLabeledInputProps & {
  options: string[]
}
const DropDownLabeledInput = (props: TDropDownLabeledInputProps) => {
  const { label, onChange, value, options } = props
  const isDisabled = onChange === undefined

  return (
    <FlexBox vertical={true} flexBias={1}>
      <BaseText text={label} styles={{ margin: '4px 0' }} />
      <select
        id={`${label}-dropdown`}
        value={value}
        onChange={!!onChange ?
          (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)
          :
          undefined
        }
        style={{
          ...LABELED_INPUT_STYLE_BASE,
          cursor: !!onChange ? 'pointer' : undefined
        }}
        disabled={isDisabled}
      >
        {options.map((option, index) => {
          return <option
            value={option}
            key={`${label}-option-${index}`}
            disabled={isDisabled}
          >{option}</option>
        })}
      </select>
    </FlexBox>
  )
}

interface ITimeSlotPicker {
  session: ISession,
  isStartTime: boolean,
  onUpdate?: (session: ISession) => void
}

const TimeSlotDropDown = (props: ITimeSlotPicker) => {
  const { settingsManager } = useContext(AppInstance)
  const { session, isStartTime, onUpdate } = props
  const value = isStartTime ? session.start_time : session.end_time
  const label = isStartTime ? 'Start time' : 'End time'
  const availableStartTimeSlots = TimeSlotManager.getWorkingHourTimeSlots(settingsManager.artistSettings)
  const options = isStartTime ? availableStartTimeSlots : TimeSlotManager.getEndingTimeSlots(availableStartTimeSlots, session.start_time)

  return <DropDownLabeledInput
    label={label}
    value={value}
    options={options}
    onChange={!!onUpdate ? (value) => onUpdate({
      ...session, [isStartTime ? 'start_time' : 'end_time']: value as string
    }) : undefined}
  />
}

interface IDatePicker {
  session: ISession,
  onUpdate?: (session: ISession) => void
}

const DateDropDown = (props: IDatePicker) => {
  const { session, onUpdate } = props
  const normalizedDate = FromUtcDate(session.date)
  const value = normalizedDate.weekdayWithYearString()
  const options = TimeSlotManager.buildDateListOptions(normalizedDate.offsetMoment())

  return <DropDownLabeledInput
    label={'Date'}
    value={value}
    options={options}
    onChange={onUpdate ? (value) => {
      onUpdate({
        ...session,
        date: moment(value, 'dddd, MMM D').format()
      })
    } : undefined}
  />
}

const InsetLabeledInput = (props: TLabeledInputProps) => {
  const { label, onChange, value, minHeight } = props
  const isActive = !!onChange
  return (
    <FlexBox vertical={true}>
      <BaseText text={label} styles={{ margin: '4px 0' }} />
      <input
        type={'text'}
        value={value}
        onChange={isActive ?
          (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)
          :
          undefined
        }
        style={{
          padding: 10,
          border: '0px solid black',
          borderRadius: 4,
          fontSize: 16,
          color: isActive ? 'black' : 'gray',
          cursor: isActive ? 'pointer' : undefined,
          background: isActive ? Colors.LIGHT_GREY_00 : Colors.DARK_GREY,
          boxShadow: 'inset 4px 4px 10px 2px #0000007a',
          minHeight
        }}
        disabled={onChange === undefined}
      />
    </FlexBox>
  )
}

type TButtonTimeSlotProps = IButtonTimeSlot & {
  action?: () => void,
  isActive: boolean
}
const ButtonTimeSlot = (props: TButtonTimeSlotProps) => {
  const { start_time, action, isActive, is_available } = props

  return (
    <button
      onChange={action}
      // className={"simple-hover"}
      disabled={!is_available}
      style={{
        background: is_available ? isActive ? Colors.BLUE_00 : 'white' : 'grey',
        border: `1px solid ${Colors.BLUE_00}`,
        borderRadius: BorderRadius.r4,
        padding: '4px 8px',
        margin: 5
      }}
    >
      <text
        style={{
          color: isActive ? 'white' : Colors.BLUE_00,
          fontSize: FontSizes.f14
        }}
      >{`${start_time}`}</text>
    </button>
  )
}

interface ISimpleLabelAndValueProps {
  label: string,
  value: string | number
}

const SimpleLabelAndValue = (props: ISimpleLabelAndValueProps) => {
  const { label, value } = props

  return (
    <FlexBox>
      <BaseText
        text={`${label}:`}
        size={14}
        color={Colors.LIGHT_GREY_00}
        alignment={'center'}
      />
      <HorizontalSpacer size={5} />
      <BaseText
        text={`${value}`}
        styles={{
          fontWeight: 'bold',
          margin: '4px 0'
        }}
      />
    </FlexBox>
  )
}

export {
  SCheckBox,
  LabeledInput,
  LabeledTextAreaInput,
  StateLabeledInput,
  InsetLabeledInput,
  DropDownLabeledInput,
  ButtonTimeSlot,
  TimeSlotDropDown,
  DateDropDown,
  SimpleLabelAndValue
}