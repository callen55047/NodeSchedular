import React, { useContext } from 'react'
import { Colors } from '../../theme/Theme'
import { MessagingContext } from './MessagingContext'
import { isNullOrEmpty, orderByCreatedAt } from '../../internal/ObjectHelpers'
import {
  NoConversationAvailable,
  ReverseScrollContainer,
  ConversationUserOverlay, ConversationListHeightSpacer
} from './conversationView/ConversationViewComps'
import { FlexBox } from '../components/view/FlexLayouts'
import MessageInputRow from './conversationView/MessageInputRow'
import MessageBubble from './conversationView/MessageBubble'
import InquiryStructure from '../../internal/dataAccess/InquiryStructure'
import { NavContext } from '../navigator/NavContext'
import SessionStructure from '../../internal/dataAccess/SessionStructure'

export default function ConversationView() {
  return (
    <FlexBox
      vertical={true}
      style={{
        height: '100%',
        background: Colors.DARK_GREY,
        position: 'relative'
      }}
    >
      <ConversationUserOverlay />
      <ReverseScrollContainer>
        <MessageListView />
      </ReverseScrollContainer>
      <MessageInputRow />
    </FlexBox>
  )
}

const MessageListView = () => {
  const { inquiries, sessions, auditManager } = useContext(NavContext)
  const { contact, thread, tMessages } = useContext(MessagingContext)

  if (!thread) {
    return <NoConversationAvailable contact={contact} />
  }

  const contactInquiries = InquiryStructure.allForContact(inquiries, contact!)
  const contactBookings = SessionStructure.allForContact(sessions, contact!)
  const auditRecords = auditManager.getAllForUserSessions(contactBookings)
  const allItems = [...tMessages, ...contactInquiries, ...contactBookings, ...auditRecords]
  const orderedItems = orderByCreatedAt(allItems)

  return (
    <React.Fragment>
      {orderedItems.reverse().map((item) => {
        return <MessageBubble item={item} />
      })}
      <ConversationListHeightSpacer />
    </React.Fragment>
  )
}