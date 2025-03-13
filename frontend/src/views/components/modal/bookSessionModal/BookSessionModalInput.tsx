import { createSubSession, ISession, ISubSession } from '../../../../internal/models/Session'
import { FlexBox } from '../../view/FlexLayouts'
import { Text24 } from '../../../../theme/CustomText'
import { DividerLine, HorizontalSpacer, VerticalSpacer } from '../../ViewElements'
import { DropDownLabeledInput, LabeledInput, StateLabeledInput, LabeledTextAreaInput } from '../../Inputs'
import React, { useContext } from 'react'
import { AppInstance } from '../../../../appEntry/appContainer/AppContext'
import TimeSlotManager from '../../../../internal/dateAndTime/TimeSlotManager'
import FromUtcDate, { CreateUtcDate } from '../../../../internal/DateAndTime'
import { SubSessionTimeEdit } from './BookSessionComponents'
import { SimpleButton } from '../../Buttons'

type TSessionTabProps = {
  session: ISession,
  updateSession: (session: ISession) => void
}
export default function BookSessionModalInput(props: TSessionTabProps) {
  const { settingsManager } = useContext(AppInstance)
  const { session, updateSession } = props

  const normalizedDate = FromUtcDate(session.date)
  const availableStartTimeSlots = TimeSlotManager.getWorkingHourTimeSlots(settingsManager.artistSettings)
  const availableEndTimeSlots = TimeSlotManager.getEndingTimeSlots(availableStartTimeSlots, session.start_time)

  function updateEventWithDate(date: string) {
    if (!date) {
      return
    }

    const updatedDate = CreateUtcDate(date)
    updateSession({
      ...session,
      date: updatedDate.utcString()
    })
  }

  function updateStartTime(start_time: string) {
    if (start_time.localeCompare(session.end_time) >= 0) {
      const end_time = start_time
      updateSession({ ...session, start_time, end_time })
    } else {
      updateSession({ ...session, start_time })
    }
  }

  function updateSessionField(value: number | string | boolean, field: string) {
    updateSession({ ...session, [field]: value })
  }

  function updatePrice(value: number) {
    const newDeposit = Number((value * 0.20).toFixed(2))
    updateSession({ ...session, price: value, deposit: newDeposit })
  }

  function addNewSubSession() {
    updateSession({
      ...session,
      sub_sessions: [
        ...session.sub_sessions,
        createSubSession(settingsManager.artistSettings)
      ]
    })
  }

  return (
    <FlexBox vertical={true} style={{ padding: 15 }}>
      <FlexBox justify={'flex-start'}>
        <Text24 text={'Create New Session'} />
      </FlexBox>
      <VerticalSpacer size={15} />

      <FlexBox
        vertical={true}
        style={{
          maxHeight: 500,
          overflowY: 'auto',
        }}
      >
        <FlexBox>
          <LabeledInput
            label={'Date'}
            value={normalizedDate.dashCase()}
            type={'date'}
            onChange={updateEventWithDate}
          />
          <HorizontalSpacer size={10} />
          <DropDownLabeledInput
            label={'Start time'}
            value={session.start_time}
            options={availableStartTimeSlots}
            onChange={(value) => updateStartTime(value)}
          />
          <HorizontalSpacer size={10} />
          <DropDownLabeledInput
            label={'End time'}
            value={session.end_time}
            options={availableEndTimeSlots}
            onChange={(value) => updateSessionField(value as string, 'end_time')}
          />
        </FlexBox>

        {session.sub_sessions.map((sub, index) => {
          return (
            <SubSessionTimeEdit
              subSession={sub}
              updateSubSession={(sub) => {
                const newSubSessions = [...session.sub_sessions]
                !!sub ?
                  newSubSessions.splice(index, 1, sub) :
                  newSubSessions.splice(index, 1)

                updateSession({
                  ...session,
                  sub_sessions: newSubSessions,
                })
              }}
              index={index}
            />
          )
        })}

        {session.sub_sessions.length < 4 &&
          <FlexBox justify={'flex-start'} margin={'5px 0'}>
            <SimpleButton
              theme={"PRIMARY"}
              text={'Add Additional Date'}
              action={addNewSubSession}
              slim
            />
          </FlexBox>
        }

        <DividerLine />

        <LabeledTextAreaInput
          label={'Description'}
          value={session.description}
          onChange={(value) => updateSessionField(value, 'description')}
        />

        <FlexBox>
          <LabeledInput
            label={'Deposit'}
            value={session.deposit}
          />
          <HorizontalSpacer size={10} />
          <LabeledInput
            label={'Total price'}
            value={session.price}
            onChange={(value) => updatePrice(value as number)}
          />
        </FlexBox>
        {/*TODO: decide how to handle tax included flag*/}
        {/*<SCheckBox*/}
        {/*    text={"Price includes tax?"}*/}
        {/*    checked={session.includes_tax}*/}
        {/*    onChange={(value) => updateSessionField(value, 'includes_tax')}*/}
        {/*/>*/}
      </FlexBox>
    </FlexBox>
  )
}
