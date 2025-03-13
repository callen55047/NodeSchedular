import { ETransactionType, ITransaction } from '../../../internal/models/Transaction'
import { removeDuplicatesBasedOnUpdatedAt } from '../../../internal/ObjectHelpers'
import { ISession } from '../../../internal/models/Session'

type TransactionState = ITransaction[]
type TransactionAction = {
  type: 'ADD' | 'OVERWRITE' | 'REMOVE_CASH_PAYMENT',
  list?: ITransaction[],
  session?: ISession
}

function TransactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  const { type, list, session } = action

  switch (type) {
    case 'ADD':
      return [...state, ...list!]
    case 'OVERWRITE':
      const newCombined = removeDuplicatesBasedOnUpdatedAt([...state, ...list!])
      return [...newCombined]
    case 'REMOVE_CASH_PAYMENT':
      const cashPayment = state.find((t) => {
        return t.product_id === session?._id &&
          t.is_cash_payment &&
          t.type === ETransactionType.PAYMENT &&
          !t.stripe_payment_success &&
          !t.stripe_intent_id
      })
      const listWithoutCashPayment = state.filter((t) => t._id !== cashPayment?._id)
      return [...listWithoutCashPayment]
    default:
      return state
  }
}

export {
  TransactionReducer,
  TransactionState,
  TransactionAction
}