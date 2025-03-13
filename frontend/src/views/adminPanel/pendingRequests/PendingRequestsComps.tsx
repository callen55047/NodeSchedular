import { objIsIInquiry } from '../../../internal/models/Inquiry'
import { FlexBox } from '../../components/view/FlexLayouts'
import { HorizontalSpacer, Icon } from '../../components/ViewElements'
import { BaseText } from '../../../theme/CustomText'
import { objIsISession } from '../../../internal/models/Session'
import { IAccount } from '../../../internal/models/Account'
import { ProfileAvatar } from '../../images/ImageDisplayViews'
import { Colors } from '../../../theme/Theme'
import HorizontalFilesDisplay from '../../components/images/HorizontalFilesDisplay'
import FromUtcDate from '../../../internal/DateAndTime'
import SessionDate from '../../../internal/dateAndTime/SessionDate'
import React from 'react'

const TitleCell = ({ item }: { item: any }) => {
  if (objIsIInquiry(item)) {
    return (
      <FlexBox>
        <Icon
          name={'fa-stack-overflow'}
          margin={0}
        />
        <HorizontalSpacer size={5} />
        <BaseText text={'Inquiry'} size={18} />
      </FlexBox>
    )
  } else if (objIsISession(item)) {
    return (
      <FlexBox>
        <Icon
          name={'fa-book'}
          margin={0}
        />
        <HorizontalSpacer size={5} />
        <BaseText text={'Session'} size={18} />
      </FlexBox>
    )
  }

  return null
}

const AccountData = ({ account }: { account: IAccount }) => {
  return (
    <FlexBox justify={'flex-start'}>
      <FlexBox vertical>
        <ProfileAvatar
          size={50}
          src={account.profile_pic?.url}
        />
      </FlexBox>

      <HorizontalSpacer size={10} />

      <FlexBox vertical>
        <BaseText
          text={account.username}
          styles={{ fontWeight: 'bold' }}
          size={14}
        />
        <BaseText
          text={`${account.first_name} ${account.last_name}`}
          color={Colors.LIGHT_GREY_00}
          size={14}
        />
        <BaseText
          text={account.email}
          color={Colors.LIGHT_GREY_00}
          size={14}
        />
        <BaseText
          text={account.phone_number}
          color={Colors.LIGHT_GREY_00}
          size={14}
        />
      </FlexBox>
    </FlexBox>
  )
}

const DetailsData = ({ item }: { item: any }) => {
  if (objIsIInquiry(item)) {
    return (
      <FlexBox vertical>
        <BaseText
          text={`$${item.budget}`}
          styles={{ fontWeight: 'bold' }}
          color={Colors.GREEN}
          size={14}
        />
        <BaseText
          text={
            `${item.timeline}, 
          ${item.body_location}, 
          ${item.size}, 
          ${item.working_on_existing_tattoo},
          ${item.description}`
          }
          color={Colors.LIGHT_GREY_00}
          size={14}
        />
        {/*TODO: add custom fields string values*/}
        <BaseText
          text={`Custom fields: TBA`}
          color={Colors.LIGHT_GREY_00}
          size={14}
        />
        <HorizontalFilesDisplay files={item.attachments} width={30} />
      </FlexBox>
    )
  } else if (objIsISession(item)) {
    const dateText = FromUtcDate(item.date).weekdayWithYearString()
    const timeLength = SessionDate(item).timeLengthString()
    const additionalDates = item.sub_sessions?.map(s => {
      return FromUtcDate(s.date).weekdayWithYearString()
    }) ?? []

    return (
      <FlexBox vertical>
        <BaseText
          text={dateText}
          styles={{ fontWeight: 'bold' }}
          size={14}
        />
        <BaseText
          text={timeLength}
          color={Colors.LIGHT_GREY_00}
          size={14}
        />
        <BaseText
          text={`Additional dates: ${additionalDates}`}
          color={Colors.LIGHT_GREY_00}
          size={14}
        />
      </FlexBox>
    )
  }

  return null
}

export {
  TitleCell,
  DetailsData,
  AccountData
}