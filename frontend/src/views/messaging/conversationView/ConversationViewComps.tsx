import React, { FormEvent, useContext } from 'react'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { Icon } from '../../components/ViewElements'
import { RChildren } from '../../../types/GenericTypes'
import { buildBorderRadius, TSelectCornerRadius } from '../../components/ViewModifiers'
import { BaseText } from '../../../theme/CustomText'
import { FlexBox } from '../../components/view/FlexLayouts'
import { MessagingContext } from '../MessagingContext'
import { ContactMessagesHeaderDisplay } from '../../components/UserViewComps'
import { IAccount } from '../../../internal/models/Account'

const ConversationUserOverlay = () => {
  const { contact } = useContext(MessagingContext)
  if (!contact) {
    return null
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2,
      background: 'linear-gradient(#000000, transparent)',
      backdropFilter: 'blur(6px)',
      borderRadius: 10,
      display: 'flex',
      width: '100%',
    }}>
      <ContactMessagesHeaderDisplay contact={contact} />
    </div>
  )
}

type TConversationButtonProps = {
  onSend: (e: FormEvent) => void,
  background: string,
  foreground?: string,
  icon: string,
  corners: TSelectCornerRadius,
  hint?: string
}
const ConversationButton = (props: TConversationButtonProps) => {
  const { onSend, background, foreground, icon, corners, hint } = props

  return (
    <button style={{
      borderRadius: buildBorderRadius(corners, BorderRadius.r10),
      border: 'none',
      background,
      cursor: 'pointer'
    }}
            title={hint}
            onClick={onSend}
    >
      <Icon
        name={icon}
        color={foreground || 'white'}
        rSize={1.3}
        margin={10}
      />
    </button>
  )
}

type TNoConversationProps = {
  contact?: IAccount
}
const NoConversationAvailable = (props: TNoConversationProps) => {
  const { contact } = props
  const text = contact ?
    `Send ${contact.first_name} a new message!` : 'No conversation to show.'

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <text style={{
          fontSize: 16,
          color: 'white',
          fontWeight: 'bold'
        }}>{text}</text>
      </div>
    </div>
  )
}

const ReverseScrollContainer = ({ children }: RChildren) => {
  return <div
    className={'scroll-view'}
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column-reverse'
    }}
  >{children}</div>
}

const PillLegendItem = ({ color, text }: { color: string, text: string }) => {
  return (
    <FlexBox
      style={{ margin: '5px 0', alignItems: 'center' }}
      justify={'center'}
    >
      <div style={{
        width: 10,
        height: 10,
        borderRadius: 10,
        background: color,
        marginRight: 5
      }} />
      <BaseText text={text} />
    </FlexBox>
  )
}

type TPillViewProps = RChildren & {
  background?: string,
  label?: string,
  deleteAction?: () => void
}
const PillView = ({ children, label, background, deleteAction }: TPillViewProps) => {
  return (
    <div style={{
      margin: 8,
      textAlign: 'center'
    }}>
      {label && <BaseText text={label} styles={{ marginBottom: 2 }} />}
      <div style={{
        background,
        borderRadius: BorderRadius.r10,
        padding: '4px'
      }}>
        {deleteAction &&
          <Icon
            name={'fa-times'}
            margin={2}
            color={'black'}
            onClick={deleteAction}
          />
        }
        {children}
      </div>
    </div>
  )
}

type TPillTextViewProps = {
  label?: string,
  variant?: 'red' | 'white',
  text: string
}
const PillTextView = ({ text, label, variant }: TPillTextViewProps) => {
  let background, fontColor
  switch (variant) {
    case 'red':
      background = Colors.RED_00
      fontColor = 'black'
      break
    case 'white':
      background = Colors.OFF_WHITE
      fontColor = 'black'
      break
    default:
      background = Colors.LIGHT_GREY_00
      fontColor = 'white'
      break
  }

  return (
    <PillView label={label} background={background}>
      <BaseText text={text} color={fontColor} />
    </PillView>
  )
}

type TMessageAttachmentProps = {
  file: File,
  deleteAction: () => void
}
const MessageAttachmentPill = (props: TMessageAttachmentProps) => {
  const { file, deleteAction } = props

  return (
    <PillView background={Colors.RED_00} deleteAction={deleteAction}>
      <BaseText text={file.name} color={'black'} />
    </PillView>
  )
}

const ConversationListHeightSpacer = () => {
  return <FlexBox vertical={true}>
    <div style={{ height: 125 }} />
  </FlexBox>
}

export {
  ConversationUserOverlay,
  ConversationButton,
  NoConversationAvailable,
  ReverseScrollContainer,
  PillLegendItem,
  PillView,
  PillTextView,
  MessageAttachmentPill,
  ConversationListHeightSpacer
}