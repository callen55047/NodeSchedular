import React from 'react'
import { IAccount } from '../../../../internal/models/Account'
import { FlexBox } from '../../view/FlexLayouts'
import { Colors } from '../../../../theme/Theme'
import { StarList } from '../../UserViewComps'
import { BaseText } from '../../../../theme/CustomText'
import FromUtcDate from '../../../../internal/DateAndTime'
import { HorizontalSpacer, VerticalSpacer } from '../../ViewElements'
import { ProfileAvatar } from '../../../images/ImageDisplayViews'
import ContactDetailsContainer from './ContactDetailsContainer'

interface IContactReviewsProps {
  contact: IAccount
}

export default function ContactReviews(props: IContactReviewsProps) {
  const { contact } = props

  return (
    <>
      {contact.ratings.map((rating) => {
        return (
          <>
            <ContactDetailsContainer>
              <FlexBox justify={'flex-start'}>
                <ProfileAvatar
                  size={25}
                  src={undefined}
                />
                <HorizontalSpacer size={10} />
                <BaseText text={'Artist'} alignment={'center'} />
              </FlexBox>
              <VerticalSpacer size={5}/>

              <FlexBox justify={'flex-start'}>
                <StarList ratings={[rating]} size={1} margin={1} />
                <HorizontalSpacer size={5} />
                <BaseText
                  text={rating.tags}
                  styles={{ fontWeight: 'bold' }}
                  alignment={'center'}
                />
              </FlexBox>
              <VerticalSpacer size={5}/>

              <BaseText text={rating.comment} />
              <VerticalSpacer size={5}/>

              <BaseText
                text={FromUtcDate(rating.created_at).weekdayString()}
                color={Colors.MONEY_GREEN}
                size={12}
              />
            </ContactDetailsContainer>
            <VerticalSpacer size={10} />
          </>
        )
      })}
    </>
  )
}