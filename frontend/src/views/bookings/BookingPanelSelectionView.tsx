import React, { useContext, useEffect, useState } from 'react'
import { ContactBookingHeaderDisplay } from '../components/UserViewComps'
import { HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import { FlexBox } from '../components/view/FlexLayouts'
import { ISession } from '../../internal/models/Session'
import { NavContext } from '../navigator/NavContext'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { ErrorTextBlock } from '../components/HorizontalMessageBox'
import CompleteBookingModal from './CompleteBookingModal'
import CancelBookingModal from './CancelBookingModal'
import { EditSaveButton, EditSessionDetails } from './BookingPanelViewComps'
import { getDiff } from '../../internal/ObjectHelpers'
import { toast } from 'react-toastify'

type TBookingEventPanelProps = {
  session: ISession
  resetSelectedSession: () => void
}
export default function BookingPanelSelectionView(props: TBookingEventPanelProps) {
  const { api, runBlocking, logger } = useContext(AppInstance)
  const { sessionDispatch } = useContext(NavContext)
  const { session, resetSelectedSession } = props
  const [localSession, setLocalSession] = useState<ISession>({ ...session })
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false)

  // generated properties
  const bookingHasChanges = JSON.stringify(session) !== JSON.stringify(localSession)

  useEffect(() => {
    cancelChanges()
  }, [session._id])

  function cancelChanges() {
    setLocalSession({ ...session })
    setIsInEditMode(false)
  }

  function saveChanges() {
    runBlocking(async () => {
      const changes = getDiff(session, localSession)
      if (changes.price) {
        const minimumPrice = Math.min(session.deposit * 2, session.price)
        if (changes.price < minimumPrice) {
          changes.price = minimumPrice
          toast.warn(`Session price is too low. Auto correcting to ${minimumPrice}.`)
        }
      }

      const res = await api.session.update({ _id: session._id, ...changes })
      if (res?.session) {
        sessionDispatch({ type: 'UPDATE_BOOKING', session: res.session })
        setIsInEditMode(false)
        toast.success('Session has updated successfully.')
      } else {
        toast.error(`Could not update session. Please try again later.`)
        logger.error(`Session: ${session._id} update failed. Res from server was NULL`)
      }
    })
  }

  function completeCallback() {
    resetSelectedSession()
  }

  return (
    <FlexBox vertical={true}>
      <FlexBox>
        <FlexBox flexBias={1} justify={'flex-start'}>
          <ContactBookingHeaderDisplay session={session} />
        </FlexBox>
        <FlexBox vertical={true}>
          <EditSaveButton
            isInEditMode={isInEditMode}
            setEditMode={() => setIsInEditMode(true)}
            hasChanges={bookingHasChanges}
            cancel={cancelChanges}
            save={saveChanges}
          />
        </FlexBox>
        <HorizontalSpacer size={15} />
      </FlexBox>

      <VerticalSpacer size={15} />

      <FlexBox flexBias={1}>
        <FlexBox vertical={true}>
          {session.has_conflict &&
            <ErrorTextBlock
              text={'Attention! This session has a time slot conflict. Please review your bookings.'}
            />
          }
          <EditSessionDetails
            session={localSession}
            update={setLocalSession}
            isInEditMode={isInEditMode}
          />
          <VerticalSpacer size={15} />
          {isInEditMode ?
            <CancelBookingModal
              completeCallback={completeCallback}
              session={session}
            />
            :
            <CompleteBookingModal
              completeCallback={completeCallback}
              session={session}
            />
          }
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}
