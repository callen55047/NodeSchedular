import React, { useContext } from 'react'
import { FlexBox } from '../../view/FlexLayouts'
import { BorderRadius, Colors } from '../../../../theme/Theme'
import { DropDownLabeledInput, LabeledInput } from '../../Inputs'
import { HorizontalSpacer, Icon } from '../../ViewElements'
import { ISubSession } from '../../../../internal/models/Session'
import FromUtcDate, { CreateUtcDate } from '../../../../internal/DateAndTime'
import TimeSlotManager from '../../../../internal/dateAndTime/TimeSlotManager'
import { AppInstance } from '../../../../appEntry/appContainer/AppContext'
import { BaseText } from '../../../../theme/CustomText'
import { buildBorderRadius } from '../../ViewModifiers'

interface ISessionTimeEditProps {
  subSession: ISubSession
  updateSubSession?: (timeslot: ISubSession | null) => void,
  index: number
}
const SubSessionTimeEdit = (props: ISessionTimeEditProps) => {
  const { settingsManager } = useContext(AppInstance)
  const { subSession, updateSubSession, index } = props

  const normalizedDate = FromUtcDate(subSession.date)
  const availableStartTimeSlots = TimeSlotManager.getWorkingHourTimeSlots(settingsManager.artistSettings)
  const availableEndTimeSlots = TimeSlotManager.getEndingTimeSlots(availableStartTimeSlots, subSession.start_time)

  function onDateChange(date: string) {
    if (!date) {
      return
    }

    const updatedDate = CreateUtcDate(date)
    updateSubSession!({
      ...subSession,
      date: updatedDate.utcString()
    })
  }

  function updateStartTime(start_time: string) {
    if (start_time.localeCompare(subSession.end_time) >= 0) {
      const end_time = start_time
      updateSubSession!({ ...subSession, start_time, end_time })
    } else {
      updateSubSession!({ ...subSession, start_time })
    }
  }

  function updateEndTime(end_time: string) {
    updateSubSession!({ ...subSession, end_time })
  }

  return (
    <FlexBox
      margin={'5px 0'}
      style={{
        border: `1px solid ${Colors.BLUE_00}`,
        borderRadius: BorderRadius.r4,
      }}
      vertical
    >
      <FlexBox
        justify={'space-between'}
        style={{
          backgroundColor: Colors.BLUE_00,
          borderRadius: buildBorderRadius("top", BorderRadius.r4),
          padding: '2px 5px'
        }}
      >
        <BaseText
          text={`Additional Date ${index + 1}`}
          size={14}
        />
        {!!updateSubSession &&
          <Icon
            name={"fa-times"}
            margin={0}
            onClick={() => updateSubSession(null)}
          />
        }
      </FlexBox>


      <FlexBox style={{padding: 5}}>
        <LabeledInput
          label={'Date'}
          value={normalizedDate.dashCase()}
          type={'date'}
          onChange={!!updateSubSession ? onDateChange : undefined}
        />
        <HorizontalSpacer size={10} />
        <DropDownLabeledInput
          label={'Start time'}
          value={subSession.start_time}
          options={availableStartTimeSlots}
          onChange={!!updateSubSession ? (value) => updateStartTime(value) : undefined}
        />
        <HorizontalSpacer size={10} />
        <DropDownLabeledInput
          label={'End time'}
          value={subSession.end_time}
          options={availableEndTimeSlots}
          onChange={!!updateSubSession ? (value) => updateEndTime(value) : undefined}
        />
      </FlexBox>
    </FlexBox>
  )
}

export {
  SubSessionTimeEdit
}