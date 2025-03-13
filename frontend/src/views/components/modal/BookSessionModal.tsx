import React, { ReactNode, useContext, useState } from 'react'
import { ModalBase } from '../Modal'
import { FlexBox } from '../view/FlexLayouts'
import { DynamicSpacer, HorizontalSpacer } from '../ViewElements'
import { SimpleButton } from '../Buttons'
import { BorderRadius, Colors, FontSizes } from '../../../theme/Theme'
import { createLocalSession, ISession } from '../../../internal/models/Session'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { buildBorderRadius } from '../ViewModifiers'
import BookSessionModalInput from './bookSessionModal/BookSessionModalInput'
import TimeSlotManager from '../../../internal/dateAndTime/TimeSlotManager'
import { IAccount } from '../../../internal/models/Account'
import { IThread } from '../../../internal/models/Thread'
import { InvisibleChildWrapper } from './ModalViewComps'
import { toast } from 'react-toastify'
import { NavContext } from '../../navigator/NavContext'

type TBookSessionModalProps = {
  children: ReactNode,
  contact?: IAccount,
  thread: IThread
}
export default function BookSessionModal(props: TBookSessionModalProps) {
  const { api, runBlocking, currentUser, settingsManager } = useContext(AppInstance)
  // const { contacts } = useContext(NavContext)
  const { contact, thread, children } = props
  const [isActive, setIsActive] = useState(false)
  const [newSession, setNewSession] = useState<ISession>(() => createTempSession())

  // const [selectedContactId, setSelectedContactId] = useState<string | null>(contact?._id || null)

  function createTempSession(): ISession {
    const settings = settingsManager.artistSettings
    const { start_time, end_time } = TimeSlotManager.getDefaultStartEndTime(settings)
    return createLocalSession(
      currentUser!._id,
      start_time,
      end_time,
      settings.default_deposit,
      settings.default_price,
      settings.default_price_includes_tax
    )
  }

  function submitBooking() {
    if ((newSession.price < 1) || (newSession.start_time === newSession.end_time)) {
      return
    }

    runBlocking(async () => {
      const sessionToCreate = {
        ...newSession,
        thread_id: thread!._id,
        user_id: contact!._id
      }
      const res = await api.session.create(sessionToCreate)
      if (res?.success) {
        toast.success(`Session created!`)
      } else {
        toast.error(`Could not create session`)
      }

      resetAndClose()
    })
  }

  function resetAndClose() {
    setNewSession(createTempSession())
    setIsActive(false)
  }

  return (
    <React.Fragment>
      <InvisibleChildWrapper onClick={() => setIsActive(true)}>
        {children}
      </InvisibleChildWrapper>

      <ModalBase
        isActive={isActive}
        setIsActive={setIsActive}
        shouldCloseOnEsc={false}
      >
        <FlexBox
          vertical={true}
          style={{ background: Colors.LIGHT_GREY_00 }}
        >
          <BookSessionModalInput
            session={newSession}
            updateSession={setNewSession}
          />

          <FlexBox style={{ padding: '0 15px 15px 0' }}>
            {/*TODO: show error here instead of buttons when sessions are invalid */}
            <DynamicSpacer size={1} />
            <SimpleButton
              text={'Cancel'}
              theme={'SECONDARY'}
              action={resetAndClose}
            />
            <HorizontalSpacer size={10} />
            <SimpleButton
              text={'Submit'}
              theme={'PRIMARY'}
              action={submitBooking}
            />
          </FlexBox>
        </FlexBox>
      </ModalBase>
    </React.Fragment>
  )
}

type TSessionHeaderTabProps = {
  index: number,
  isActive: boolean,
  isCreateNew: boolean,
  action: (index: number) => void
}
const SessionHeaderTab = ({ index, isCreateNew, action, isActive }: TSessionHeaderTabProps) => {
  const displayText = isCreateNew ? '+' : index + 1
  return (
    <span
      style={{
        padding: '2px 32px',
        background: (isCreateNew || !isActive) ? Colors.DARK_GREY : Colors.LIGHT_GREY_00,
        borderRadius: buildBorderRadius('top', BorderRadius.r10),
        fontSize: FontSizes.f14,
        cursor: 'pointer'
      }}
      onClick={() => action(index)}
    >
            <text
              style={{
                fontWeight: isCreateNew ? 'bold' : 'normal',
                color: 'white'
              }}>{displayText}</text>
        </span>
  )
}
