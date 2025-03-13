import React, { useContext } from 'react'
import { BaseButton } from '../../components/Buttons'
import { ModalBase } from '../../components/Modal'
import { ContainerWithHeaderCloseButton } from '../../components/modal/ModalViewComps'
import { SuccessTextBlock, WarningTextBlock } from '../../components/HorizontalMessageBox'
import { FlexBox } from '../../components/view/FlexLayouts'
import { DividerLine, VerticalSpacer } from '../../components/ViewElements'
import { BaseText } from '../../../theme/CustomText'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { ISession } from '../../../internal/models/Session'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { NavContext } from '../../navigator/NavContext'
import TransactionStructure from '../../../internal/dataAccess/TransactionStructure'
import { AuditRecordListItem } from '../../components/AuditRecordViewComps'

interface ICompletedBookingProps {
  session?: ISession,
  setIsVisible: (value: boolean) => void
}
export default function CompletedHistoryBookingModal(props: ICompletedBookingProps) {
  const { runBlocking, api } = useContext(AppInstance)
  const { transactions, sessionDispatch, transactionDispatch, auditManager } = useContext(NavContext)
  const { session, setIsVisible } = props

  if (!session) {
    return null
  }

  const { remainder, payment } = TransactionStructure.allForSession(transactions, session)
  const hasFinalPayment = !!payment || !!remainder
  const isCashOrNotFullyPaid = !hasFinalPayment || remainder?.is_cash_payment
  const records = auditManager.getForSession(session)

  function close() {
    setIsVisible(false)
  }

  async function unComplete() {
    runBlocking(async () => {
      const res = await api.session.unComplete(session!)
      if (res?.session) {
        sessionDispatch({ type: "UPDATE_BOOKING", session: res.session })
        transactionDispatch({ type: 'REMOVE_CASH_PAYMENT', session })
        close()
      } else {
        console.warn(`failed to unComplete session: ${res!.session._id}`)
      }
    })
  }

  const HeaderInfoMessage = () => {
    if (!hasFinalPayment) {
      return <WarningTextBlock
        text={"Client needs to pay remaining balance"}
      />
    } else if (remainder?.is_cash_payment) {
      return <WarningTextBlock
        text={"You have collected the final payment as cash"}
      />
    } else {
      return <SuccessTextBlock
        text={"This booking is fully paid up!"}
      />
    }
  }

  return (
    <ModalBase isActive={true} setIsActive={setIsVisible} shouldCloseOnEsc={true}>
      <ContainerWithHeaderCloseButton close={close} heading={"Booking Details"}>
        <HeaderInfoMessage />

        <FlexBox
          vertical={true}
          style={{
            margin: 20,
            padding: 10,
            background: Colors.DARKER_GREY,
            borderRadius: BorderRadius.r4
          }}
        >
          <BaseText
            size={16}
            text={"Transactions"}
            styles={{fontWeight: 'bold'}}
          />
          <DividerLine />
          {records.map((record) => {
            return (
              <AuditRecordListItem record={record} />
            )
          })}
        </FlexBox>


        {isCashOrNotFullyPaid &&
          <React.Fragment>
            <WarningTextBlock
              text={"You can remove the completion which" +
                " will move this session back to Upcoming status."}
            />
            <BaseButton
              action={unComplete}
              text={"Remove Completion"}
              background={Colors.DARK_RED}
            />
          </React.Fragment>
        }

        <VerticalSpacer size={50} />
        <BaseButton
          action={close}
          text={"Go back"}
          background={'transparent'}
        />
      </ContainerWithHeaderCloseButton>
    </ModalBase>
  )
}