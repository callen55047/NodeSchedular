import React, { useContext, useEffect, useState } from 'react'
import { FullScreenTile } from './components/TileLayout'
import ConversationView from './messaging/ConversationView'
import MessageThreadList from './messaging/MessageThreadList'
import { DraftData, IMessageFilters } from './messaging/MessagingContext'
import { MessagingContext } from './messaging/MessagingContext'
import { NavContext } from './navigator/NavContext'
import { isObjNullOrEmpty } from '../internal/ObjectHelpers'
import { AppInstance } from '../appEntry/appContainer/AppContext'
import ThreadStructure from '../internal/dataAccess/ThreadStructure'
import { IThread } from '../internal/models/Thread'
import SessionStructure from '../internal/dataAccess/SessionStructure'
import { SideListSelectionView } from './components/view/ListSelectionLayout'

export default function Messaging() {
  const { api, currentUser } = useContext(AppInstance)
  const {
    setHasViewSpecificWork,
    contacts,
    threads,
    sessions,
    transactions,
    messages,
    messageDispatch
  } = useContext(NavContext)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [draftData, setDraftData] = useState<DraftData>({})
  const [activeFilters, setActiveFilters] = useState<IMessageFilters>({} as IMessageFilters)

  const filteredThreads = threads.filter(handleSearchAndFilters)
  const thread = threads.find((t) => t._id === selectedThreadId)
  const contact = thread ? contacts.find((c) => c._id === thread.user_id) : undefined
  const tMessages = thread ? messages.filter((m) => m.thread_id === thread._id) : []

  useEffect(() => {
    setHasViewSpecificWork(!isObjNullOrEmpty(draftData))
  }, [draftData])

  useEffect(() => {
    if (thread && ThreadStructure.hasUnreadMessages({ user: currentUser!, thread, messages })) {
      messageDispatch({ type: 'READ', thread_id: thread._id })
      api.threads.markMessagesAsRead(thread._id)
    }
  }, [thread, tMessages])

  // auto select item from list
  useEffect(() => {
    if (filteredThreads.length < 1) {
      setSelectedThreadId(null)
    } else {
      const newThreadIds = filteredThreads.map((t) => t._id)
      if (filteredThreads.length > 0 &&
        (!selectedThreadId || !newThreadIds.includes(selectedThreadId))
      ) {
        setSelectedThreadId(filteredThreads[0]._id)
      }
    }
  }, [filteredThreads])

  function handleSearchAndFilters(t: IThread): boolean {
    let result = true
    if (activeFilters.searchText) {
      result = filterBySearchText(t)
    }
    if (result && activeFilters.unread) {
      result = filterByUnread(t)
    }
    if (result && activeFilters.upcoming) {
      result = filterByUpcomingBookings(t)
    }
    return result
  }

  function filterBySearchText(t: IThread): boolean {
    const tContact = ThreadStructure.owningContact(t, contacts)
    const searchText = activeFilters.searchText
      .toLowerCase()
      .trim()
    const name = `${tContact.first_name} ${tContact.last_name}`
      .toLowerCase()
      .trim()
    return name.includes(searchText)
  }

  function filterByUnread(t: IThread): boolean {
    return ThreadStructure.hasUnreadMessages({ user: currentUser!, thread: t, messages })
  }

  function filterByUpcomingBookings(t: IThread): boolean {
    const threadContact = ThreadStructure.owningContact(t, contacts)
    return SessionStructure.contactHasUpcoming(threadContact, sessions, transactions)
  }

  async function requestNewThread(thread_id: string) {
    setSelectedThreadId(thread_id)
  }

  const contextData = {
    threads: filteredThreads,
    thread,
    contact,
    tMessages,
    activeFilters,
    setActiveFilters,
    requestNewThread,
    draftData,
    setDraftData
  }

  return (
    <MessagingContext.Provider value={contextData}>
      <FullScreenTile>
        <SideListSelectionView
          title={"Messages"}
          ItemListView={<MessageThreadList />}
          ItemSelectionView={<ConversationView />}
        />
      </FullScreenTile>
    </MessagingContext.Provider>
  )
}
