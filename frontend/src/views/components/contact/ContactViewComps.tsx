import { RChildren } from '../../../types/GenericTypes'
import React, { CSSProperties, MouseEventHandler, useContext } from 'react'
import { Colors, FontSizes, getSessionStatusColor } from '../../../theme/Theme'
import { DynamicSpacer, HorizontalSpacer, Icon, StatusLight, VerticalSpacer } from '../ViewElements'
import { MessagingContext } from '../../messaging/MessagingContext'
import { getMessageStatus } from '../../messaging/MessageHelper'
import { BaseText } from '../../../theme/CustomText'
import moment from 'moment'
import { IMessage } from '../../../internal/models/Message'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { ISession } from '../../../internal/models/Session'
import { NavContext } from '../../navigator/NavContext'
import { FlexBox } from '../view/FlexLayouts'
import { TrimString } from '../../../internal/StringUtils'
import SessionStructure from '../../../internal/dataAccess/SessionStructure'
import { ProfileAvatar } from '../../images/ImageDisplayViews'
import { IAccount } from '../../../internal/models/Account'
import { IInquiry } from '../../../internal/models/Inquiry'
import SessionDate from '../../../internal/dateAndTime/SessionDate'
import FromUtcDate from '../../../internal/DateAndTime'

type MCContainerType = RChildren & {
  isSelected: boolean,
  onClick: MouseEventHandler,
  hasError?: boolean,
  styles?: CSSProperties
}
const MCContainer = (props: MCContainerType) => {
  const { children, isSelected, onClick, styles, hasError } = props
  return <div
    className={'blue-outline-hover mcButton'}
    style={{
      background: hasError ? Colors.DARK_RED : Colors.DARK_GREY,
      borderRadius: 10,
      display: 'flex',
      marginBottom: 2,
      cursor: 'pointer',
      border: `1px solid ${isSelected ? Colors.BLUE_00 : 'transparent'}`,
      ...styles
    }}
    onClick={onClick}
  >{children}</div>
}

const MCBodyContainer = ({ children }: RChildren) => {
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  }}>{children}</div>
}

type TNameAndTime = {
  firstname: string,
  lastname: string,
  timestamp?: string
}
const MCNameAndTime = (props: TNameAndTime) => {
  const { firstname, lastname, timestamp } = props
  let formattedTime = ''
  if (timestamp) {
    if (moment().startOf('day').isBefore(moment(timestamp))) {
      formattedTime = moment(timestamp).format('h:mm A')
    } else {
      formattedTime = moment(timestamp).format('ddd')
    }
  }

  return <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 5
  }}>
    <text style={{ color: 'white', fontSize: 12 }}>{`${firstname} ${lastname}`}</text>
    <text style={{ color: Colors.LIGHT_GREY_00, fontSize: 10 }}>{formattedTime}</text>
  </div>
}

type TMessageAndStatus = {
  message: string,
  mStatus?: 'draft' | 'unread'
}
const MCMessageAndStatus = ({ message, mStatus }: TMessageAndStatus) => {
  return <div style={{
    display: 'flex',
    flexDirection: 'row'
  }}>
    <BaseText text={message} size={FontSizes.f10} flex={1} />
    {mStatus && <StatusLight
      color={mStatus === 'draft' ? Colors.ORANGE : Colors.LIGHT_GREEN}
    />}
  </div>
}

const ContactListDisplay = ({ children }: RChildren) => {
  return <div
    className={'scroll-view'}
    style={{ display: 'flex', flexDirection: 'column' }}
  >{children}</div>
}

type TInquiryContactProps = {
  user: IAccount,
  inquiry: IInquiry,
  isSelected: boolean,
  onClick: () => void
}
const InquiryContact = (props: TInquiryContactProps) => {
  const { user, inquiry, isSelected, onClick } = props

  return (
    <MCContainer
      isSelected={isSelected}
      onClick={onClick}
    >
      <ProfileAvatar
        src={user.profile_pic?.url}
        size={50}
        margin={10}
      />
      <MCBodyContainer>
        <MCNameAndTime
          firstname={user.first_name}
          lastname={user.last_name}
          timestamp={inquiry.created_at}
        />
        <FlexBox justify={'flex-start'}>
          <Icon
            name={'fa-dollar'}
            margin={0}
            color={Colors.GREEN}
          />
          <BaseText
            text={`${inquiry.budget}`}
            color={Colors.GREEN}
            alignment={'center'}
          />
        </FlexBox>
      </MCBodyContainer>
    </MCContainer>
  )
}

type TMessageContactProps = {
  item_id: string,
  isSelected: boolean,
  onClick: () => void,
  user: IAccount,
  lastMessage?: IMessage
}
const MessageContact = (props: TMessageContactProps) => {
  const { currentUser } = useContext(AppInstance)
  const { draftData } = useContext(MessagingContext)
  const { isSelected, item_id, onClick, user, lastMessage } = props
  const messageStatus = getMessageStatus(draftData, currentUser!._id, item_id, lastMessage)
  const messageCut = TrimString(lastMessage?.body)

  return (
    <MCContainer
      isSelected={isSelected}
      onClick={onClick}
    >
      <ProfileAvatar
        src={user.profile_pic?.url}
        size={50}
        margin={10}
      />
      <MCBodyContainer>
        <MCNameAndTime
          firstname={user.first_name}
          lastname={user.last_name}
          timestamp={lastMessage?.created_at}
        />
        <VerticalSpacer size={5} />
        <MCMessageAndStatus
          message={messageCut}
          mStatus={messageStatus}
        />
      </MCBodyContainer>
    </MCContainer>
  )
}

type TBookingContactProps = {
  session: ISession,
  handleOnClick?: (bookingId: string) => void
  isSelected: boolean,
  hasError: boolean
}
const BookingContactCard = (props: TBookingContactProps) => {
  const { contacts, transactions } = useContext(NavContext)
  const { session, handleOnClick, isSelected, hasError } = props

  const user = SessionStructure.owningContact({ session, contacts })
  const userName = `${user.first_name} ${user.last_name}`
  const amountRemaining = SessionStructure.getRemainingAmount(session, transactions)
  const hasFullyPaid = amountRemaining === 0
  const timeDisplay = SessionDate(session).timeLengthString()
  const status = SessionStructure.getSessionStatus(session, transactions)
  const statusColor = getSessionStatusColor(status)

  return (
    <MCContainer
      isSelected={isSelected}
      onClick={() => handleOnClick!(session._id)}
      hasError={hasError}
    >
      <FlexBox>
        <ProfileAvatar
          src={user.profile_pic?.url}
          size={50}
          margin={10}
        />
        <FlexBox vertical={true} justify={'center'}>
          <BaseText
            text={userName}
            size={FontSizes.f10}
          />
          <VerticalSpacer size={5} />
          <BaseText
            text={timeDisplay}
            styles={{ fontWeight: 'bold' }}
          />
          <VerticalSpacer size={5} />

          <FlexBox justify={'space-between'}>
            <BaseText
              text={status.toUpperCase()}
              color={statusColor}
            />
            <HorizontalSpacer size={5} />
            <BaseText text={`|`} />
            <HorizontalSpacer size={5} />
            <BaseText
              text={hasFullyPaid ? 'Paid in full' : `Due: $${amountRemaining}`}
              color={hasFullyPaid ? Colors.GREEN : Colors.ORANGE}
            />
          </FlexBox>
        </FlexBox>
        {hasError &&
          <React.Fragment>
            <HorizontalSpacer size={15} />
            <FlexBox vertical={true} justify={'center'}>
              <Icon name={'fa-exclamation'} margin={0} />
            </FlexBox>
          </React.Fragment>
        }
      </FlexBox>
    </MCContainer>
  )
}

type TDashboardContactProps = {
  session: ISession,
  handleOnClick?: (bookingId: string) => void
}
const DashboardContactCard = (props: TDashboardContactProps) => {
  const { contacts, transactions } = useContext(NavContext)
  const { session, handleOnClick } = props

  const user = SessionStructure.owningContact({ session, contacts })
  const userName = `${user.first_name} ${user.last_name}`
  const amountRemaining = SessionStructure.getRemainingAmount(session, transactions)
  const hasFullyPaid = amountRemaining === 0
  const timeDisplay = SessionDate(session).timeLengthString()
  const dateDisplay = FromUtcDate(session.date).weekdayString()

  return (
    <MCContainer
      isSelected={false}
      onClick={() => handleOnClick!(session._id)}
      hasError={false}
    >
      <ProfileAvatar
        src={user.profile_pic?.url}
        size={50}
        margin={10}
      />
      <FlexBox vertical={true} justify={'center'}>
        <BaseText
          text={userName}
          size={FontSizes.f10}
        />
        <VerticalSpacer size={5} />
        <BaseText
          text={timeDisplay}
          styles={{ fontWeight: 'bold' }}
        />
        <VerticalSpacer size={5} />
        <BaseText
          text={hasFullyPaid ? 'Paid in full' : `Due: $${amountRemaining}`}
          color={hasFullyPaid ? Colors.GREEN : Colors.ORANGE}
        />

      </FlexBox>
      <DynamicSpacer size={1} />
      <FlexBox vertical={true}>
        <BaseText text={dateDisplay} />
      </FlexBox>
      <HorizontalSpacer size={10} />
    </MCContainer>
  )
}

export {
  ContactListDisplay,
  InquiryContact,
  MessageContact,
  BookingContactCard,
  DashboardContactCard
}