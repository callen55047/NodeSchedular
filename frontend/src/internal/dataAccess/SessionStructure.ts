import { IAccount } from '../models/Account'
import { ESessionStatus, ISession } from '../models/Session'
import moment from 'moment'
import { ETransactionType, ITransaction } from '../models/Transaction'
import { Dictionary, groupBy, orderBy, sortBy } from 'lodash'
import TransactionStructure from './TransactionStructure'
import { IRating } from '../models/Rating'
import FromUtcDate from '../DateAndTime'
import SessionDate from '../dateAndTime/SessionDate'

type TOwningContactProps = {
  session: ISession,
  contacts: IAccount[]
}

type TContactSessionOrNoneProps = {
  contact: IAccount,
  sessions: ISession[]
}

const SessionStructure = {

  validSessions: (sessions: ISession[]): ISession[] => {
    return sessions.filter((session) => !session.cancelled_at && !session.rejected_at)
  },

  invalidSessions: (sessions: ISession[]): ISession[] => {
    return sessions.filter((session) => session.cancelled_at || session.rejected_at)
  },

  owningContact: (props: TOwningContactProps): IAccount => {
    const { session, contacts } = props
    return contacts.find((c) => c._id === session.user_id)!
  },

  contactSessionOrNone: (props: TContactSessionOrNoneProps): ISession | undefined => {
    const { contact, sessions } = props
    return sessions.find((s) => s.user_id === contact._id)
  },

  contactHasUpcoming: (contact: IAccount, sessions: ISession[], transactions: ITransaction[]): boolean => {
    const contactSessions = sessions.filter((s) => {
      return s.user_id === contact._id &&
        SessionStructure.getSessionStatus(s, transactions) === ESessionStatus.UPCOMING
    })
    return contactSessions.length > 0
  },

  sessionsForDate: (sessions: ISession[], date: moment.Moment): ISession[] => {
    return SessionStructure.validSessions(sessions)
      .filter((s) => moment(s.date).isSame(date.utc(), 'day'))
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  },

  sessionHasPayment: (session: ISession, transactions: ITransaction[]): boolean => {
    const activePayments = transactions.filter((t) => t.product_id === session._id)
    return activePayments.length > 0
  },

  getRemainingAmount: (session: ISession, transactions: ITransaction[]): number => {
    const sTransactions = transactions.filter((t) => t.product_id === session._id)
    if (sTransactions.length < 1) {
      return session.price
    }

    let amountRemaining = 0
    for (const t of sTransactions) {
      if (t.type === ETransactionType.DEPOSIT) {
        amountRemaining = session.price - session.deposit
      } else if ([ETransactionType.PAYMENT, ETransactionType.REMAINDER].includes(t.type)) {
        return 0
      }
    }
    return amountRemaining
  },

  getSessionsByStatus: (sessions: ISession[], transactions: ITransaction[], states: ESessionStatus[]): ISession[] => {
    return sessions
      .filter((s) => states.includes(SessionStructure.getSessionStatus(s, transactions)))
  },

  getSessionStatus: (session: ISession, transactions: ITransaction[]): ESessionStatus => {
    if (session.cancelled_at || session.rejected_at) {
      return ESessionStatus.INVALID
    }

    const sessionTransactions = transactions.filter((t) => t.product_id === session._id)
    if (sessionTransactions.length < 1) {
      return ESessionStatus.PENDING
    }

    if (!session.artist_completed_at) {
      return ESessionStatus.UPCOMING
    }

    // TODO: check for disputed status

    const hasCompletedPayment = TransactionStructure.hasCompletedPayment(sessionTransactions)
    if (hasCompletedPayment) {
      return ESessionStatus.COMPLETED
    } else {
      return ESessionStatus.TATTOO_COMPLETE
    }
  },

  getArtistCompletedSessions: (sessions: ISession[], transactions: ITransaction[]): ISession[] => {
    return SessionStructure.validSessions(sessions)
      .filter((s) => [ESessionStatus.COMPLETED, ESessionStatus.TATTOO_COMPLETE]
        .includes(SessionStructure.getSessionStatus(s, transactions)))
  },

  canCompleteSession: (session: ISession, transactions: ITransaction[]): boolean => {
    const status = SessionStructure.getSessionStatus(session, transactions)
    const isOnOrPastDate = FromUtcDate(session.date).isBeforeRightNow()
    return status === ESessionStatus.UPCOMING && isOnOrPastDate
  },

  /**
   * Sessions with a deposit, and have a completion date that is past
   * NOTE: sessions can only be completed with a valid deposit
   */
  filterReadyForPayment: (sessions: ISession[], transactions: ITransaction[]): ISession[] => {
    return SessionStructure.validSessions(sessions).filter((session) => {
      const hasPaidDeposit = SessionStructure.sessionHasPayment(session, transactions)
      const hasPastCompletionDate = FromUtcDate(session.date).isBeforeRightNow()
      return hasPaidDeposit && hasPastCompletionDate && !session.artist_completed_at
    })
  },

  filterToday: (sessions: ISession[]): ISession[] => {
    return SessionStructure.validSessions(sessions).filter((session) => {
      return moment(session.date).isSame(moment().utc(), 'day')
    })
  },

  sortByDate: (sessions: ISession[]): ISession[] => {
    return orderBy(sessions, (s) => s.date, 'desc')
  },

  groupByDate: (sessions: ISession[]): Dictionary<ISession[]> => {
    const sortedByDate = sortBy(sessions, (s) => new Date(s.date))
    return groupBy(sortedByDate, (s) => moment(s.date).startOf('day').format())
  },

  prepareSessionsByStartTime: (sessions: ISession[]): ISession[] => {
    const ordered = orderBy(sessions, (s) => s.start_time, 'asc')
    return ordered.map((s) => {
      const time = SessionDate(s)
      const has_conflict = ordered.find((item) => time.hasOverlappingTimeSlot(item)) !== undefined
      return { ...s, has_conflict }
    })
  },

  allForContact: (session: ISession[], contact: IAccount): ISession[] => {
    return session.filter((s) => s.user_id === contact._id)
  },

  getRating: (session: ISession, user: IAccount): IRating => {
    return user.ratings.find((r) => r.session_id === session._id)
      || { receiver_id: user._id, session_id: session._id } as IRating
  }

}

export default SessionStructure