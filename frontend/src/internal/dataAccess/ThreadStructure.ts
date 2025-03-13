import { IAccount, IPortalUser } from '../models/Account'
import { IThread } from '../models/Thread'
import { IMessage } from '../models/Message'

interface IThreadUnreadMessagesProps {
  user: IAccount,
  thread: IThread,
  messages: IMessage[]
}

interface IAllUnreadMessagesProps {
  messages: IMessage[],
  user: IPortalUser
}

const ThreadStructure = {

  owningContact: (thread: IThread, contacts: IAccount[]): IAccount => {
    return contacts.find((c) => c._id === thread.user_id)!
  },

  hasUnreadMessages: (props: IThreadUnreadMessagesProps): boolean => {
    const { user, thread, messages } = props

    const unreadMessages = messages.filter((m) => {
      return m.thread_id === thread._id &&
        m.sender_id !== user._id &&
        !m.is_read
    })
    return unreadMessages.length > 0
  },

  allUnreadMessages: (props: IAllUnreadMessagesProps): number => {
    const { messages, user } = props

    const unreadMessages = messages.filter((m) => {
      return m.sender_id !== user?._id && !m.is_read
    })
    return unreadMessages.length
  }
}

export default ThreadStructure