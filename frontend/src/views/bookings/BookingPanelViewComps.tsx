import { FlexBox } from '../components/view/FlexLayouts'
import ConfirmationModal from '../components/modal/ConfirmationModal'
import { SimpleButton, SmallIconButton } from '../components/Buttons'
import { Colors } from '../../theme/Theme'
import React, { useContext } from 'react'
import { DateDropDown, InsetLabeledInput, LabeledInput, LabeledTextAreaInput, TimeSlotDropDown } from '../components/Inputs'
import { HorizontalSpacer } from '../components/ViewElements'
import { createSubSession, ISession, ISubSession } from '../../internal/models/Session'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { detailedAddress } from '../../internal/models/shared/Address'
import { SubSessionTimeEdit } from '../components/modal/bookSessionModal/BookSessionComponents'
import FromUtcDate, { CreateUtcDate } from '../../internal/DateAndTime'

interface IEditSessionDetailProps {
  session: ISession,
  update: (session: ISession) => void,
  isInEditMode: boolean
}

function EditSessionDetails(props: IEditSessionDetailProps) {
  const { currentUser, settingsManager } = useContext(AppInstance)
  const { session, update, isInEditMode } = props

  const normalizedDate = FromUtcDate(session.date)
  const defaultLocation = session.location || `${detailedAddress(currentUser?.address)} (default)`

  function addNewSubSession() {
    update({
      ...session,
      sub_sessions: [
        ...session.sub_sessions,
        createSubSession(settingsManager.artistSettings)
      ]
    })
  }

  function onDateChange(date: string) {
    if (!date) {
      return
    }

    const updatedDate = CreateUtcDate(date)
    update({
      ...session,
      date: updatedDate.utcString()
    })
  }

  function updateSubSession(sub: ISubSession | null, index: number) {
    const newSubSessions = [...session.sub_sessions]
    !!sub ?
      newSubSessions.splice(index, 1, sub) :
      newSubSessions.splice(index, 1)

    update({
      ...session,
      sub_sessions: newSubSessions,
    })
  }

  return (
    <FlexBox vertical={true}>
      <FlexBox justify={'flex-start'}>
        <LabeledInput
          label={'Date'}
          value={normalizedDate.dashCase()}
          type={'date'}
          onChange={isInEditMode ? onDateChange : undefined}
        />
        {/*<DateDropDown session={session} onUpdate={isInEditMode ? update : undefined} />*/}
        <HorizontalSpacer size={20} />
        <TimeSlotDropDown
          session={session}
          isStartTime={true}
          onUpdate={isInEditMode ? update : undefined}
        />
        <HorizontalSpacer size={20} />
        <TimeSlotDropDown
          session={session}
          isStartTime={false}
          onUpdate={isInEditMode ? update : undefined}
        />
      </FlexBox>

      {session.sub_sessions.map((sub, index) => {
        return (
          <SubSessionTimeEdit
            subSession={sub}
            index={index}
            updateSubSession={isInEditMode ? (s) => updateSubSession(s, index) : undefined}
          />
        )
      })}

      {(isInEditMode && session.sub_sessions.length < 4) &&
        <FlexBox justify={'flex-start'} margin={'5px 0'}>
          <SimpleButton
            theme={"PRIMARY"}
            text={'Add Additional Date'}
            action={addNewSubSession}
            slim
          />
        </FlexBox>
      }

      <LabeledInput
        label={'Location'}
        value={isInEditMode ? session.location || '' : defaultLocation}
        onChange={isInEditMode ? (value) => update({ ...session, location: value }) : undefined}
      />
      <LabeledTextAreaInput
        label={'Description'}
        minHeight={50}
        value={session.description || ''}
        onChange={isInEditMode ? (value) => update({ ...session, description: value }) : undefined}
      />
      <LabeledTextAreaInput
        label={'Notes (artist view only)'}
        minHeight={50}
        value={session.artist_notes}
        onChange={isInEditMode ? (value) => update({ ...session, artist_notes: value }) : undefined}
      />
      <FlexBox justify={'flex-start'}>
        <InsetLabeledInput
          label={'Deposit'}
          value={`$${session.deposit}`}
        />
        <HorizontalSpacer size={20} />
        <LabeledInput
          label={'Total price'}
          value={session.price}
          onChange={isInEditMode ? (value) => update({ ...session, price: value }) : undefined}
        />
      </FlexBox>
    </FlexBox>
  )
}

interface IEditSaveButtonProps {
  isInEditMode: boolean,
  setEditMode: () => void,
  hasChanges: boolean,
  cancel: () => void,
  save: () => void
}

const EditSaveButton = (props: IEditSaveButtonProps) => {
  const { isInEditMode, setEditMode, hasChanges, cancel, save } = props

  if (isInEditMode) {
    return <FlexBox>
      {hasChanges &&
        <ConfirmationModal
          action={save}
          title={'Confirm Edit Booking'}
          text={
            'Warning: If you are making changes to the date, time, or price ' +
            'please be sure to communicate those changes to the client. ' +
            'Failure to do so can result in the client being fully refunded.'
          }
        >
          <SmallIconButton
            icon={'fa-floppy-o'}
            background={Colors.GREEN}
            action={() => {
            }}
          />
        </ConfirmationModal>
      }
      <SmallIconButton
        icon={'fa-undo'}
        background={Colors.YELLOW}
        action={cancel}
      />
    </FlexBox>
  } else {
    return <FlexBox>
      <SmallIconButton
        icon={'fa-pencil'}
        background={Colors.ORANGE}
        action={setEditMode}
      />
    </FlexBox>
  }
}

export {
  EditSaveButton,
  EditSessionDetails
}