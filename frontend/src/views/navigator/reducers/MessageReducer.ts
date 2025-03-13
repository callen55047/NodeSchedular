import { IMessage } from '../../../internal/models/Message'
import { removeDuplicatesBasedOnUpdatedAt } from '../../../internal/ObjectHelpers'

type MessageState = IMessage[]
type MessageAction = {
  type: 'APPEND' | 'READ',
  list?: IMessage[],
  thread_id?: string
}

function MessageReducer(state: MessageState, action: MessageAction): MessageState {
  const { type, list, thread_id } = action

  switch (type) {
    case 'APPEND':
      return removeDuplicatesBasedOnUpdatedAt([...state, ...list!])
    case 'READ':
      const listWithReadMessages = state.map((m) => {
        if (m.thread_id === thread_id) {
          m.is_read = true
        }
        return m
      })
      return [...listWithReadMessages]
    default:
      return state
  }
}

export {
  MessageReducer,
  MessageState,
  MessageAction
}