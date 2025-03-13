import React, { useContext, useState } from 'react'
import { ModalBase } from '../components/Modal'
import { FlexBox } from '../components/view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { BaseButton } from '../components/Buttons'
import { VerticalSpacer } from '../components/ViewElements'
import { ISession } from '../../internal/models/Session'
import { NavContext } from '../navigator/NavContext'
import SessionStructure from '../../internal/dataAccess/SessionStructure'
import { SCheckBox } from '../components/Inputs'
import { Colors } from '../../theme/Theme'
import { SuccessTextBlock, WarningTextBlock } from '../components/HorizontalMessageBox'
import { ContainerWithHeaderCloseButton } from '../components/modal/ModalViewComps'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { RateUserSessionView } from '../components/contact/UserRatingViews'

type TConfirmationModalProps = {
  completeCallback: () => void,
  session: ISession
}
export default function CompleteBookingModal(props: TConfirmationModalProps) {
  const { runBlocking, api } = useContext(AppInstance)
  const { transactions, sessionDispatch, transactionDispatch } = useContext(NavContext)
  const { completeCallback, session } = props
  const [isVisible, setIsVisible] = useState(false)
  const [isCashPayment, setIsCashPayment] = useState(false)

  const canComplete = SessionStructure.canCompleteSession(session, transactions)
  const amountRemaining = SessionStructure.getRemainingAmount(session, transactions)
  const amountPaid = session.price - amountRemaining
  const isFullyPaid = amountRemaining === 0

  function close() {
    setIsVisible(false)
  }

  function confirmAndClose() {
    close()
    completeCallback()
  }

  function completeBooking() {
    runBlocking(async () => {
      const completeRes = await api.session.complete(session, isCashPayment)
      if (completeRes) {
        sessionDispatch({ type: 'UPDATE_BOOKING', session: completeRes.session })
        if (completeRes.transaction) {
          transactionDispatch({ type: 'OVERWRITE', list: [completeRes.transaction] })
        }
        confirmAndClose()
      } else {
        console.warn('failed to complete session')
      }
    })
  }

  if (!canComplete) {
    return null
  }

  return (
    <React.Fragment>
      <BaseButton
        background={Colors.GREEN}
        text={"Complete Session"}
        action={() => setIsVisible(true)}
      />

      <ModalBase isActive={isVisible} setIsActive={setIsVisible} shouldCloseOnEsc={false}>
        <ContainerWithHeaderCloseButton close={close} heading={"Complete Booking"}>
          <SuccessTextBlock text={"We will notify the user and move this session to Completed."} />
          {isCashPayment &&
            <WarningTextBlock
              text={
                "Heads up! This means you are collecting a cash payment from the client. " +
                "We will consider this booking completed and fully paid."
              }
            />
          }

          {!isFullyPaid &&
            <FlexBox vertical={true}>
              <VerticalSpacer size={15} />
              <FlexBox justify={'space-between'}>
                <BaseText
                  text={"Paid:"}
                />
                <BaseText
                  size={16}
                  text={`$${amountPaid.toFixed(2)}`}
                  color={Colors.GREEN}
                />
              </FlexBox>
              <VerticalSpacer size={5} />
              <FlexBox justify={'space-between'}>
                <BaseText
                  text={"Amount due:"}
                />
                <BaseText
                  size={18}
                  text={`$${amountRemaining.toFixed(2)}`}
                  color={Colors.ORANGE}
                />
              </FlexBox>

              <VerticalSpacer size={15} />
              <SCheckBox
                text={"Customer paid in cash"}
                checked={isCashPayment}
                onChange={(value) => setIsCashPayment(value)}
              />
            </FlexBox>
          }
          <VerticalSpacer size={20} />
          <RateUserSessionView session={session} />
          <VerticalSpacer size={50} />
          <BaseButton
            action={completeBooking}
            text={"Complete Booking"}
            background={Colors.GREEN}
          />
          <VerticalSpacer size={10} />
          <BaseButton
            action={close}
            text={"Go back"}
            background={'transparent'}
          />
        </ContainerWithHeaderCloseButton>
      </ModalBase>
    </React.Fragment>
  )
}