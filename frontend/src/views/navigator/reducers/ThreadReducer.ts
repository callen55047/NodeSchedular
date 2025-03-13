import { IThread } from '../../../internal/models/Thread'
import { removeDuplicatesBasedOnId } from '../../../internal/ObjectHelpers'

type ThreadState = IThread[]
type ThreadAction = {
  type: "APPEND",
  list: IThread[]
}

function ThreadReducer(state: ThreadState, action: ThreadAction): ThreadState {
  const { type, list } = action

  switch (type) {
    case 'APPEND':
      return removeDuplicatesBasedOnId(state, list)
    default:
      return state
  }
}

export {
  ThreadReducer,
  ThreadState,
  ThreadAction
}