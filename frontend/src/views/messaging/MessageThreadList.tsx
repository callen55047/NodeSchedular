import React, { useContext } from 'react'
import { DynamicSpacer, VerticalSpacer } from '../components/ViewElements'
import { NavContext } from '../navigator/NavContext'
import { MessagingContext } from './MessagingContext'
import { ContactListDisplay, MessageContact } from '../components/contact/ContactViewComps'
import { lastOrNone } from '../../internal/ObjectHelpers'
import { FilterButton, SearchBox } from '../components/ListViewComponents'
import { FlexBox } from '../components/view/FlexLayouts'

export default function MessageThreadList() {
  const { contacts, messages } = useContext(NavContext)
  const {
    requestNewThread,
    threads,
    thread,
    activeFilters,
    setActiveFilters
  } = useContext(MessagingContext)

  function onSearchForContact(text: string) {
    setActiveFilters({ ...activeFilters, searchText: text })
  }

  return (
    <React.Fragment>
      <SearchBox
        currentValue={activeFilters.searchText}
        onChange={onSearchForContact}
      />
      <VerticalSpacer size={8} />
      <FlexBox style={{marginBottom: 8}}>
        <FilterButton
          text={'Unread'}
          isActive={activeFilters.unread}
          onChange={(state) => setActiveFilters({ ...activeFilters, unread: state })}
        />
        <DynamicSpacer size={1} />
        <FilterButton
          text={'Upcoming Bookings'}
          isActive={activeFilters.upcoming}
          onChange={(state) => setActiveFilters({ ...activeFilters, upcoming: state })}
        />
      </FlexBox>
      <ContactListDisplay>
        {threads.map((t) => {
          const tContact = contacts.find((c) => c._id === t.user_id)!
          const currentMessages = messages.filter((m) => m.thread_id === t._id)

          return <MessageContact
            item_id={t._id}
            isSelected={t._id === thread?._id}
            onClick={() => requestNewThread(t._id)}
            user={tContact}
            lastMessage={lastOrNone(currentMessages)}
          />
        })}
      </ContactListDisplay>
    </React.Fragment>
  )
}
