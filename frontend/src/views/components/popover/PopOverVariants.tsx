import { Colors } from '../../../theme/Theme'
import { HorizontalSpacer, Icon } from '../ViewElements'
import { BaseText } from '../../../theme/CustomText'
import React from 'react'
import { RChildren } from '../../../types/GenericTypes'
import Popover from '../Popover'
import { SimpleButton } from '../Buttons'

interface IPopoverListItemProps {
  icon: string,
  text: string,
  action: () => void
}

const PopoverListItem = (props: IPopoverListItemProps) => {
  const { icon, text, action } = props

  return (
    <div
      className={'simple-hover'}
      style={{
        flex: 1,
        padding: 10,
        background: Colors.LIGHT_GREY_00
      }}
      onClick={action}
    >
      <Icon name={icon} margin={'0 10px 0 0'} color={'white'} />
      <HorizontalSpacer size={10} />
      <BaseText text={text} />
    </div>
  )
}

interface IPopoverListProps {
  title: string,
  options: IPopoverListItemProps[]
}
const PopoverButtonList = (props: IPopoverListProps) => {
  const { title, options } = props

  return (
    <Popover
      content={options.map((option) => <PopoverListItem {...option} />)}
      autoClose={true}
    >
      <SimpleButton
        theme={'PRIMARY'}
        text={title}
        action={() => {}}
        slim={true}
        icon={'fa-align-justify'}
      />
    </Popover>
  )
}

export {
  PopoverButtonList
}