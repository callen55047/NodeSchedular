import { ISession } from '../../models/Session.js'
import { ETransactionType, ITransaction } from '../../models/Transaction.js'

interface ISessionsWithTransactions {
  name: string,
  session: ISession,
  transactions: ITransaction[]
}

const mockSession = { price: 1000, deposit: 200 } as ISession
const mockDeposit = { type: ETransactionType.DEPOSIT } as ITransaction
const mockPayment = { type: ETransactionType.PAYMENT } as ITransaction

const SessionWithTransactions: ISessionsWithTransactions[] = [
  {
    name: 'Deposit only cancelled by user',
    session: { ...mockSession, cancelled_by_user: true },
    transactions: [mockDeposit]
  },
  {
    name: 'Deposit only cancelled by artist',
    session: { ...mockSession, cancelled_by_user: false },
    transactions: [mockDeposit]
  },
  {
    name: 'Deposit and payment cancelled by user',
    session: { ...mockSession, cancelled_by_user: true },
    transactions: [mockDeposit, mockPayment]
  },
  {
    name: 'Deposit and payment cancelled by artist',
    session: { ...mockSession, cancelled_by_user: false },
    transactions: [mockDeposit, mockPayment]
  },
  {
    name: 'Payment only cancelled by user',
    session: { ...mockSession, cancelled_by_user: true },
    transactions: [mockPayment]
  },
  {
    name: 'Payment only cancelled by artist',
    session: { ...mockSession, cancelled_by_user: false },
    transactions: [mockPayment]
  },
]

export default SessionWithTransactions