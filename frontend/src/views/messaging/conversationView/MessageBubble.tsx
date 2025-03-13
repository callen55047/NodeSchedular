import { IMessage, objIsIMessage } from '../../../internal/models/Message'
import React, { useContext } from 'react'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { Colors, FontSizes } from '../../../theme/Theme'
import { FlexBox } from '../../components/view/FlexLayouts'
import { EInquiryStatus, IInquiry, objIsIInquiry } from '../../../internal/models/Inquiry'
import { ESessionStatus, ISession, objIsISession } from '../../../internal/models/Session'
import { HorizontalSpacer, VerticalSpacer } from '../../components/ViewElements'
import { BaseText } from '../../../theme/CustomText'
import { NavContext } from '../../navigator/NavContext'
import SessionStructure from '../../../internal/dataAccess/SessionStructure'
import { MBBodyText, MBEventContainer, MBItemContainer } from './messageBubble/MessageBubbleViewComps'
import { EAuditRecordType, IAuditRecord, objIsIAuditRecord } from '../../../internal/models/AuditRecord'
import FromUtcDate from '../../../internal/DateAndTime'
import SessionDate from '../../../internal/dateAndTime/SessionDate'
import HorizontalFilesDisplay from '../../components/images/HorizontalFilesDisplay'

interface IMessageBubbleProps {
  item: any
}
export default function MessageBubble(props: IMessageBubbleProps) {
  const { item } = props

  if (objIsIMessage(item)) {
    return <MessageBubbleText message={item as IMessage} />
  } else if (objIsIInquiry(item)) {
    return <MessageBubbleInquiry inquiry={item as IInquiry} />
  } else if (objIsISession(item)) {
    return <MessageBubbleSession session={item as ISession} />
  } else if (objIsIAuditRecord(item)) {
    return <MessageBubbleAuditRecord record={item as IAuditRecord} />
  }

  return null
}

const MessageBubbleText = ({ message }: { message: IMessage }) => {
  const { currentUser } = useContext(AppInstance)
  const isSender = message.sender_id === currentUser?._id

  return (
    <MBItemContainer isSender={isSender}>
      {message.attachments.length > 0 &&
        <React.Fragment>
          <FlexBox>
            {message.attachments.map((att) => {
              return (
                <React.Fragment>
                  <img
                    src={att.url}
                    alt={'message-attachment'}
                    style={{
                      maxWidth: 200,
                      maxHeight: 400
                    }}
                  />
                  <HorizontalSpacer size={5} />
                </React.Fragment>
              )
            })}
          </FlexBox>
          <VerticalSpacer size={5} />
        </React.Fragment>
      }
      <text
        style={{ color: 'white', fontSize: FontSizes.f14 }}
      >{message.body}</text>
    </MBItemContainer>
  )
}

const MessageBubbleInquiry = ({ inquiry }: { inquiry: IInquiry }) => {
  const dateText = FromUtcDate(inquiry.created_at).weekdayString()
  const isAccepted = inquiry.status === EInquiryStatus.ACCEPTED
  let color = Colors.MONEY_GREEN
  let displayText = "Accepted"

  if (inquiry.status === EInquiryStatus.PENDING) {
    color = Colors.ORANGE
    displayText = "Pending"
  } else if (inquiry.status !== EInquiryStatus.ACCEPTED) {
    color = Colors.DARK_RED
    displayText = inquiry.status.toUpperCase()
  }

  return (
    <MBEventContainer
      isSender={false}
      title={'Inquiry'}
      icon={'fa-stack-overflow'}
    >
      <BaseText text={dateText} color={Colors.OFF_WHITE_2} />
      <VerticalSpacer size={5} />
      <BaseText text={`Budget: ${inquiry.budget}`} color={Colors.OFF_WHITE_2} />
      <VerticalSpacer size={5} />
      <BaseText text={`Timeline: ${inquiry.timeline}`} color={Colors.OFF_WHITE_2} />
      <VerticalSpacer size={5} />
      <BaseText text={`Location: ${inquiry.body_location}`} color={Colors.OFF_WHITE_2} />
      <VerticalSpacer size={5} />
      <BaseText text={`Size: ${inquiry.size}`} color={Colors.OFF_WHITE_2} />
      <VerticalSpacer size={5} />
      <BaseText text={`Work on Existing: ${inquiry.working_on_existing_tattoo}`} color={Colors.OFF_WHITE_2} />
      <VerticalSpacer size={5} />
      <BaseText text={`Description: ${inquiry.description}`} color={Colors.OFF_WHITE_2} />
      <VerticalSpacer size={5} />
      {inquiry.fields.map((field) => {
        return (
          <>
            <BaseText text={`${field.field}: ${field.value}`} color={Colors.OFF_WHITE_2} />
            <VerticalSpacer size={5} />
          </>
        )
      })}
      <HorizontalFilesDisplay
        title={'Attachments'}
        files={inquiry.attachments}
        width={50}
      />

      <BaseText
        text={displayText}
        color={color}
        alignment={"end"}
        styles={{fontWeight: 'bold'}}
        size={16}
      />
      {!isAccepted &&
        <BaseText
          text={inquiry.artist_notes}
          color={color}
          alignment={"end"}
        />
      }
    </MBEventContainer>
  )
}

// TODO: add click link to booking page (need to listen for session type and id)
const MessageBubbleSession = ({ session }: { session: ISession }) => {
  const { transactions } = useContext(NavContext)
  const date = SessionDate(session)
  const dateText = date.localDate.weekdayString()
  const timeSlot = date.timeLengthString()
  const status = SessionStructure.getSessionStatus(session, transactions)
  const isAccepted = ![ESessionStatus.INVALID, ESessionStatus.DISPUTED].includes(status)
  const statusText = isAccepted ? status.toString() : session.rejected_at ? "Rejected" : "Cancelled"
  const color = isAccepted ? Colors.MONEY_GREEN : Colors.DARK_RED

  return (
    <MBEventContainer
      isSender={true}
      title={'Booking'}
      icon={'fa-calendar'}
    >
      <MBBodyText text={dateText} bold />
      <VerticalSpacer size={2} />
      <MBBodyText text={timeSlot} />
      {session.sub_sessions.map((sub) => {
        const subDate = SessionDate(sub as ISession)
        return (
          <>
            <VerticalSpacer size={5} />
            <MBBodyText text={subDate.localDate.weekdayString()} bold />
            <VerticalSpacer size={2} />
            <MBBodyText text={subDate.timeLengthString()} />
          </>
        )
      })}

      <BaseText
        text={statusText}
        color={color}
        alignment={"end"}
        styles={{fontWeight: 'bold'}}
        size={16}
      />
      {!isAccepted &&
        <BaseText
          text={session.cancel_reason || session.user_notes}
          color={color}
          alignment={"end"}
        />
      }
    </MBEventContainer>
  )
}

const MessageBubbleAuditRecord = ({ record }: { record: IAuditRecord }) => {
  const date = FromUtcDate(record.created_at)
  const dateText = date.weekdayString()
  const isRefund = record.type === EAuditRecordType.REFUND
  const isCash = record.type === EAuditRecordType.CASH
  const title = isRefund ? 'Refund' : 'Payment'
  const icon = isCash ? 'fa-money' : 'fa-cc-stripe'
  const color = [EAuditRecordType.CONFIRM, EAuditRecordType.CASH].includes(record.type) ?
    Colors.MONEY_GREEN : Colors.DARK_RED
  const charge = record.charge ? record.charge / 100 : 0

  return (
    <MBEventContainer
      isSender={false}
      title={title}
      icon={icon}
    >
      <MBBodyText text={dateText} />
      <VerticalSpacer size={5} />
      <MBBodyText text={`Type: ${record.type}`} />

      <BaseText
        text={`${isRefund ? '-' : ''}$${charge}`}
        color={color}
        alignment={"end"}
        styles={{fontWeight: 'bold'}}
        size={16}
      />
      {record.type === EAuditRecordType.FAILED &&
        <BaseText
          text={record.message}
          color={color}
          alignment={"end"}
        />
      }
    </MBEventContainer>
  )
}