import { IMessage } from '../../internal/models/Message'
import React, { createContext } from 'react'
import { IThread } from '../../internal/models/Thread'
import { IAccount } from '../../internal/models/Account'

interface IMessageFilters {
  searchText: string,
  unread: boolean,
  upcoming: boolean
}
type DraftData = {
  [key: string]: string | undefined
}
type MessageStatus = 'draft' | 'unread' | undefined

interface IMessagingContext {
  threads: IThread[],
  thread: IThread | undefined,
  contact: IAccount | undefined,
  tMessages: IMessage[],
  activeFilters: IMessageFilters,
  setActiveFilters: React.Dispatch<React.SetStateAction<IMessageFilters>>,
  requestNewThread: (thread_id: string) => void,
  draftData: DraftData,
  setDraftData: React.Dispatch<React.SetStateAction<DraftData>>
}

const MessagingContext = createContext({} as IMessagingContext)

export {
  IMessageFilters,
  DraftData,
  MessageStatus,
  MessagingContext
}
