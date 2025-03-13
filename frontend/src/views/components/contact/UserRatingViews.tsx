import { FlexBox } from '../view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { Icon, VerticalSpacer } from '../ViewElements'
import { BorderRadius, Colors } from '../../../theme/Theme'
import React, { useContext, useState } from 'react'
import SessionStructure from '../../../internal/dataAccess/SessionStructure'
import { ISession } from '../../../internal/models/Session'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { NavContext } from '../../navigator/NavContext'
import { IRating } from '../../../internal/models/Rating'

const TagOptions = ['On time', 'Friendly', 'Polite', 'Easy to work with']
let timeoutHandle = -1

interface IRateUserSessionProps {
  session: ISession
}
const RateUserSessionView = (props: IRateUserSessionProps) => {
  const { api } = useContext(AppInstance)
  const { contacts, contactDispatch } = useContext(NavContext)
  const { session } = props
  const user = SessionStructure.owningContact({ session, contacts })
  const [rating, setRating] = useState(() => SessionStructure.getRating(session, user))
  const tags = rating.tags?.split(',') || []

  function setQuality(value: number) {
    const updatedRating = { ...rating, quality: value }
    setRating(updatedRating)
    commitChangesDelayed(updatedRating)
  }

  function onTagSelected(tag: string) {
    let newTags
    if (tags.includes(tag)) {
      newTags = tags.filter((t) => t !== tag)
    } else {
      newTags = [...tags, tag]
    }
    const updatedRating = {...rating, tags: newTags.join(',')}
    setRating(updatedRating)
    commitChangesDelayed(updatedRating)
  }

  function commitChangesDelayed(updatedRating: IRating) {
    clearTimeout(timeoutHandle)
    timeoutHandle = setTimeout(async () => {
      const newRating = await api.account.rate(updatedRating)
      if (newRating) {
        contactDispatch({ type: 'UPDATE_RATING', rating: newRating })
      }
    }, 2000)
  }

  return (
    <FlexBox
      vertical={true}
      style={{
        borderRadius: BorderRadius.r4,
        border: `1px solid ${Colors.LIGHT_GREY_00}`,
        padding: 20,
        textAlign: 'center'
      }}
    >
      <BaseText
        text={`How was your experience tattooing ${user.first_name}?`}
        size={20}
        styles={{ fontWeight: 'bold' }}
      />
      <VerticalSpacer size={5} />
      <BaseText
        text={'Ratings and reviews of clients are visible to other artists on the platform.'}
        color={Colors.LIGHT_GREY_00}
      />
      <VerticalSpacer size={10} />

      <FlexBox>
        {[...Array(5).keys()].map((_, index) => {
          return <Icon
            name={'fa-star'}
            color={rating.quality >= (index + 1) ? Colors.RED_00 : Colors.LIGHT_GREY_00}
            margin={3}
            rSize={2}
            onClick={() => setQuality(index + 1)}
          />
        })}
      </FlexBox>
      <VerticalSpacer size={10} />

      <FlexBox wrap={'wrap'} justify={'center'}>
        {TagOptions.map((tag) => {
          const isSelected = tags.includes(tag)
          return <UserRatingTag
            value={tag}
            isActive={isSelected}
            onClick={onTagSelected}
          />
        })}
      </FlexBox>

    </FlexBox>
  )
}

interface IUserRatingTagProps {
  value: string,
  isActive: boolean,
  onClick: (tag: string) => void
}
const UserRatingTag = (props: IUserRatingTagProps) => {
  const { value, isActive, onClick } = props

  return (
    <span
      style={{
        borderRadius: BorderRadius.r10,
        background: isActive ? Colors.RED_00 : Colors.LIGHT_GREY_00,
        padding: '6px 16px',
        margin: 5,
        cursor: 'pointer',
        alignSelf: 'center'
      }}
      onClick={() => onClick(value)}
    >
      <text
        style={{color: 'white'}}
      >{value}</text>
    </span>
  )
}

export {
  RateUserSessionView
}