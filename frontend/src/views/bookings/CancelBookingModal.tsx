import React, { useContext, useState } from 'react'
import { ISession } from '../../internal/models/Session'
import { NavContext } from '../navigator/NavContext'
import { BaseButton } from '../components/Buttons'
import { ModalBase } from '../components/Modal'
import { FlexBox } from '../components/view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { SInputTextArea, VerticalSpacer } from '../components/ViewElements'
import SessionStructure from '../../internal/dataAccess/SessionStructure'
import { SCheckBox } from '../components/Inputs'
import { ErrorTextBlock, SuccessTextBlock, WarningTextBlock } from '../components/HorizontalMessageBox'
import { Colors } from '../../theme/Theme'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { ContainerWithHeaderCloseButton } from '../components/modal/ModalViewComps'
import { toast } from 'react-toastify'
import FromUtcDate from '../../internal/DateAndTime'

type TCancelBookingModalProps = {
  completeCallback: () => void,
  session: ISession
}
export default function CancelBookingModal(props: TCancelBookingModalProps) {
  const { runBlocking, api } = useContext(AppInstance)
  const { transactions, sessionDispatch } = useContext(NavContext)
  const { completeCallback, session } = props
  const [isVisible, setIsVisible] = useState(false)
  const [cancelledByUser, setCancelledByUser] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const hasPayment = SessionStructure.sessionHasPayment(session, transactions)
  const amountRemaining = SessionStructure.getRemainingAmount(session, transactions)
  const pricePaid = session.price - amountRemaining
  const isPastSessionDate = FromUtcDate(session.date).isBeforeRightNow()

  function close() {
    setIsVisible(false)
  }

  function confirmAndClose() {
    close()
    completeCallback()
  }

  function cancelBooking(cancelledByUser: boolean, reason: string) {
    if (!reason) {
      return
    }

    runBlocking(async () => {
      const res = await api.session.cancel(
        props.session,
        cancelledByUser,
        reason
      )
      if (res?.session) {
        toast.success(`Session #${props.session._id} cancelled`)
        sessionDispatch({ type: 'UPDATE_BOOKING', session: res.session })
        confirmAndClose()
      } else {
        console.warn("Unable to cancel session. Please try again later")
      }
    })
  }

  const PendingBookingBody = () => {
    return <FlexBox vertical={true}>
      <SuccessTextBlock text={"This session has no payments. You can cancel with no penalty."} />
      <VerticalSpacer size={25} />
      <BaseButton
        action={() => cancelBooking(false, "Created by mistake")}
        text={"Created by mistake"}
      />
      <VerticalSpacer size={10} />
      <BaseButton
        action={() => cancelBooking(false, "Wrong date or time")}
        text={"Wrong date or time"}
      />
      <VerticalSpacer size={10} />
      <BaseButton
        action={() => cancelBooking(false, "Wrong price")}
        text={"Wrong price"}
      />
      <VerticalSpacer size={30} />
      <BaseButton
        action={close}
        text={"Go back"}
        background={'transparent'}
      />
    </FlexBox>
  }

  return (
    <React.Fragment>
      <BaseButton
        background={Colors.RED_00}
        text={"Cancel Session"}
        action={() => setIsVisible(true)}
      />

      <ModalBase isActive={isVisible} setIsActive={setIsVisible} shouldCloseOnEsc={false}>
        <ContainerWithHeaderCloseButton close={close} heading={"Cancel Booking"}>
          {!hasPayment ?
            <PendingBookingBody /> :
            <FlexBox vertical={true}>
              <WarningTextBlock
                text={
                  `Warning! The client has already paid $${pricePaid}. ` +
                  "They may be entitled to a full refund if you cancel."
                }
              />
              {cancelledByUser &&
                <ErrorTextBlock
                  text={
                    "You are marking this session as cancelled by the client. " +
                    "You will keep their deposit."
                  }
                />
              }
              <VerticalSpacer size={15} />

              {/*only allow the artist to mark a no-show if on or past date of session*/}
              {isPastSessionDate &&
                <React.Fragment>
                  <SCheckBox
                    text={"Customer did not show?"}
                    checked={cancelledByUser}
                    onChange={(value) => setCancelledByUser(value)}
                  />
                </React.Fragment>
              }

              <VerticalSpacer size={10} />
              <BaseText text={"Reason"} />
              <VerticalSpacer size={5} />
              <SInputTextArea
                onChange={setCancelReason}
                value={cancelReason}
                minHeight={75}
              />

              <VerticalSpacer size={50} />
              <BaseButton
                action={() => cancelBooking(cancelledByUser, cancelReason)}
                text={"Cancel Booking"}
                background={Colors.RED_00}
              />
              <VerticalSpacer size={10} />
              <BaseButton
                action={close}
                text={"Go back"}
                background={'transparent'}
              />
            </FlexBox>
          }
        </ContainerWithHeaderCloseButton>
      </ModalBase>
    </React.Fragment>
  )
}