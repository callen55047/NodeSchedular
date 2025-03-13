import React, { useContext, useState } from 'react'
import { calculateAverageRating, IAccount } from '../../internal/models/Account'
import { FlexBox } from './view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { Colors, FontSizes } from '../../theme/Theme'
import SessionStructure from '../../internal/dataAccess/SessionStructure'
import { NavContext } from '../navigator/NavContext'
import { ISession } from '../../internal/models/Session'
import { IInquiry } from '../../internal/models/Inquiry'
import InquiryStructure from '../../internal/dataAccess/InquiryStructure'
import { ProfileAvatar } from '../images/ImageDisplayViews'
import { HorizontalSpacer, Icon } from './ViewElements'
import FromUtcDate from '../../internal/DateAndTime'
import ContactDetailsModal from './modal/ContactDetailsModal'
import { IRating } from '../../internal/models/Rating'

const ContactHeaderDisplay = ({ user }: { user: IAccount }) => {
  const subHeading = `${user.email} | ${user.phone_number}`

  return <FullWidthContactDisplayComp user={user} subHeading={subHeading} />
}

const ContactMessagesHeaderDisplay = ({ contact }: { contact: IAccount }) => {
  const { sessions } = useContext(NavContext)
  const activeBooking = SessionStructure.contactSessionOrNone({ contact, sessions })
  const bookingText = activeBooking ?
    `Booked Session | ${FromUtcDate(activeBooking.date).weekdayString()}` :
    'No sessions'

  return <FullWidthContactDisplayComp user={contact} subHeading={bookingText} />
}

const ContactBookingHeaderDisplay = ({ session }: { session: ISession }) => {
  const { contacts, transactions } = useContext(NavContext)
  const owningContact = SessionStructure.owningContact({ session, contacts })
  // const status = SessionStructure.getSessionStatus(session, transactions)
  const subHeading = `Booking ID: ${session._id}`

  return <FullWidthContactDisplayComp user={owningContact} subHeading={subHeading} />
}

const ContactInquiryHeaderDisplay = ({ inquiry }: { inquiry: IInquiry }) => {
  const { contacts } = useContext(NavContext)
  const contact = InquiryStructure.owningContact({ inquiry, contacts })
  const bookingText = `Inquiry created | ${FromUtcDate(inquiry.created_at).weekdayString()}`

  return <FullWidthContactDisplayComp user={contact} subHeading={bookingText} />
}

const FullWidthContactDisplayComp = ({ user, subHeading }: { user: IAccount, subHeading: string }) => {
  const [isActive, setActive] = useState(false)
  const name = `${user.first_name} ${user.last_name}`

  return (
    <>
      <FlexBox onClick={() => setActive(true)}>
        <ProfileAvatar
          src={user.profile_pic?.url}
          size={70}
          margin={20}
        />
        <FlexBox vertical={true} margin={'20px 0'} flexBias={1}>
          <FlexBox style={{ marginBottom: 5 }} justify={'flex-start'}>
            <text style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: FontSizes.f24
            }}>{user.username}</text>
            <HorizontalSpacer size={10} />
            <StarList ratings={user.ratings} size={1.5} />
          </FlexBox>

          <BaseText text={name} />

          <text style={{
            color: Colors.LIGHT_GREEN,
            fontSize: FontSizes.f14,
            marginTop: 5
          }}>{subHeading}</text>
        </FlexBox>
      </FlexBox>

      <ContactDetailsModal
        contact={user}
        isActive={isActive}
        setIsActive={setActive}
      />
    </>
  )
}

interface IStarListProps {
  ratings: IRating[],
  size?: number,
  margin?: number
}

const StarList = (props: IStarListProps) => {
  const { ratings, size, margin } = props
  const average = calculateAverageRating(ratings)
  const score = Math.min(Math.max(average, 0), 5)
  const roundedScore = Math.ceil(score)
  //TODO: display half stars
  return (
    <FlexBox margin={0}>
      {[...Array(5).keys()].map((_, index) => {
        return <Icon
          name={'fa-star'}
          color={roundedScore >= (index + 1) ? 'yellow' : Colors.LIGHT_GREY_01}
          margin={margin || 3}
          rSize={size || 2}
        />
      })}
    </FlexBox>
  )
}

const StarRating = (props: { num: number}) => {
  return (
    <FlexBox justify={'flex-start'}>
      <BaseText text={`${props.num}`} />
      <HorizontalSpacer size={5} />
      <Icon name={'fa-star'} margin={0} />
    </FlexBox>
  )
}

export {
  ContactHeaderDisplay,
  ContactMessagesHeaderDisplay,
  ContactBookingHeaderDisplay,
  ContactInquiryHeaderDisplay,
  StarList,
  StarRating
}