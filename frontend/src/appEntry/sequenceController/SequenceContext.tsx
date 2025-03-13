import { createContext } from 'react'
import { ITokenAuth } from '../../internal/models/Account'

type SequenceState = 'INIT' |
  'VERIFY_EMAIL' |
  'BASIC_INFO' |
  'ADDRESS' |
  'MEDIA' |
  'STRIPE_ACCOUNT' |
  'TUTORIAL' |
  'DASHBOARD' |
  'ERROR'

interface ISequenceContext {
  goToStep: (state: SequenceState) => void
}

const SequenceContext = createContext<ISequenceContext>({} as ISequenceContext)

export {
  SequenceState,
  SequenceContext
}