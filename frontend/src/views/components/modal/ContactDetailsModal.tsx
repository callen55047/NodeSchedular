import React, { useState } from 'react'
import { ModalBase, TModalStateProps } from '../Modal'
import { IAccount } from '../../../internal/models/Account'
import { FlexBox } from '../view/FlexLayouts'
import { ProfileAvatar } from '../../images/ImageDisplayViews'
import { FontSizes } from '../../../theme/Theme'
import { HorizontalSpacer, Icon, VerticalSpacer } from '../ViewElements'
import { BaseText } from '../../../theme/CustomText'
import { StarList } from '../UserViewComps'
import FromUtcDate from '../../../internal/DateAndTime'
import { MultiLabelSwitch } from '../Switches'
import ContactReviews from './ContactDetailsModal/ContactReviews'
import ContactInquiries from './ContactDetailsModal/ContactInquiries'

enum EContactDetailsTabs {
  REVIEWS = 'Reviews',
  INQUIRIES = 'Inquiries',
}

interface IContactDetailsModalProps extends TModalStateProps {
  contact: IAccount
}

export default function ContactDetailsModal(props: IContactDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<string>(EContactDetailsTabs.REVIEWS)
  const { contact, isActive, setIsActive } = props
  const name = `${contact.first_name} ${contact.last_name}`

  return (
    <ModalBase
      isActive={isActive}
      setIsActive={setIsActive}
      shouldCloseOnEsc={true}
    >
      <FlexBox margin={15} vertical>
        <FlexBox>
          <ProfileAvatar
            src={contact.profile_pic?.url}
            size={70}
            margin={20}
          />
          <FlexBox vertical={true} margin={'20px 0'} flexBias={1}>
            <FlexBox style={{ marginBottom: 5 }} justify={'flex-start'}>
              <text style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: FontSizes.f24
              }}>{contact.username}</text>
              <HorizontalSpacer size={10} />
              <StarList ratings={contact.ratings} size={1.5} />
            </FlexBox>

            <BaseText text={name} />
            <BaseText text={`Joined ${FromUtcDate(contact.created_at).weekdayWithYearString()}`} />
          </FlexBox>
          <HorizontalSpacer size={50} />
          <Icon name={'fa-times'} rSize={3} onClick={() => setIsActive(false)} />
        </FlexBox>
        <VerticalSpacer size={10} />

        <MultiLabelSwitch
          options={Object.values(EContactDetailsTabs)}
          current={activeTab}
          onSelect={setActiveTab}
        />
        <VerticalSpacer size={10} />

        <FlexBox
          vertical
          style={{
            overflow: 'auto',
            height: 500,
            width: 600
          }}
          justify={'flex-start'}
        >
          <ViewSwitch name={activeTab} contact={contact} />
        </FlexBox>
      </FlexBox>
    </ModalBase>
  )
}

const ViewSwitch = ({ name, contact }: { name: string, contact: IAccount }) => {
  switch (name) {
    case EContactDetailsTabs.REVIEWS:
      return <ContactReviews contact={contact} />
    case EContactDetailsTabs.INQUIRIES:
      return <ContactInquiries contact={contact} />
    default:
      return <div />
  }
}