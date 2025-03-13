import { IAccount } from '../../../internal/models/Account'
import { removeDuplicatesBasedOnId, removeDuplicatesBasedOnUpdatedAt } from '../../../internal/ObjectHelpers'
import { IRating } from '../../../internal/models/Rating'

type ContactState = IAccount[]
type ContactAction = {
  type: 'APPEND' | 'UPDATE_RATING',
  list?: IAccount[],
  rating?: IRating
}

function ContactReducer(state: ContactState, action: ContactAction): ContactState {
  const { type, list, rating } = action

  switch (type) {
    case 'APPEND':
      return removeDuplicatesBasedOnId(state, list!)
    case 'UPDATE_RATING':
      const user = state.find((c) => c._id === rating!.receiver_id)!
      user.ratings = removeDuplicatesBasedOnUpdatedAt<IRating>([...user.ratings!, rating!])
      const listWithoutTarget = state.filter((c) => c._id !== user._id)
      return [...listWithoutTarget, user]
    default:
      return state
  }
}

export {
  ContactReducer,
  ContactState,
  ContactAction
}