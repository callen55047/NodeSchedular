import React, { useContext, useState } from 'react'
import { BaseText } from '../../theme/CustomText'
import SessionStructure from '../../internal/dataAccess/SessionStructure'
import { Colors } from '../../theme/Theme'
import { Icon, VerticalSpacer } from '../components/ViewElements'
import { NavContext } from '../navigator/NavContext'
import TransactionStructure from '../../internal/dataAccess/TransactionStructure'
import CompletedHistoryBookingModal from './completedHistory/CompletedHistoryBookingModal'
import { BaseTable } from '../components/Tables'
import FromUtcDate from '../../internal/DateAndTime'
import SessionDate from '../../internal/dateAndTime/SessionDate'

export default function CompletedHistory() {
  const { contacts, transactions, sessions } = useContext(NavContext)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const filteredSessions = SessionStructure.getArtistCompletedSessions(sessions, transactions)
  const selectedSession = filteredSessions.find((s) => s._id === selectedSessionId)
  const orderedSessions = SessionStructure.sortByDate(filteredSessions)

  function setIsVisible(value: boolean) {
    if (!value) {
      setSelectedSessionId(null)
    }
  }

  return (
    <React.Fragment>
      <VerticalSpacer size={10} />
      <BaseText text={'View all your competed bookings'} size={20} styles={{ fontWeight: 'bold' }} />
      <VerticalSpacer size={5} />
      <BaseText
        text={'If you added a cash payment or the client has not fully paid up, ' +
          'you can remove the completion status of that booking.'}
        color={Colors.LIGHT_GREY_00}
      />
      <VerticalSpacer size={10} />

      <BaseTable
        head={
          <tr>
            <th>ID#</th>
            <th>Date</th>
            <th>Username</th>
            <th>Name</th>
            <th>Timeslot</th>
            <th>Price</th>
            <th>Due</th>
            <th>Payment</th>
            <th>Completed On</th>
          </tr>
        }
        body={
          <>
            {orderedSessions.map((session) => {
              const user = SessionStructure.owningContact({ session, contacts })
              const displayDate = FromUtcDate(session.date).weekdayString()
              const completedDate = FromUtcDate(session.artist_completed_at).weekdayString()
              const timeSlot = SessionDate(session).localDate.hourString()
              const { payment, remainder } = TransactionStructure.allForSession(transactions, session)
              const hasCompletedPayment = !!payment || !!remainder
              const amountRemaining = SessionStructure.getRemainingAmount(session, transactions)
              const paymentDueText = amountRemaining === 0 ? 'Fully paid' : `$${amountRemaining}`
              const paymentText = remainder?.is_cash_payment ? 'Cash' : 'Card'
              const paymentIcon = remainder?.is_cash_payment ? 'dollar' : 'credit-card'

              return (
                <tr
                  key={session._id}
                  onClick={() => setSelectedSessionId(session._id)}
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <td>{session._id}</td>
                  <td>{displayDate}</td>
                  <td>{user.username}</td>
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td>{timeSlot}</td>
                  <td>{session.price}</td>
                  <td>{paymentDueText}</td>
                  <td>{hasCompletedPayment &&
                    <span>
                    <Icon
                      name={`fa-${paymentIcon}`}
                      color={Colors.GREEN}
                      margin={'0 10px'}
                    />
                    <BaseText text={paymentText} color={Colors.GREEN} />
                  </span>
                  }
                  </td>
                  <td>{completedDate}</td>
                </tr>
              )
            })}
          </>
        }
      />

      <CompletedHistoryBookingModal
        session={selectedSession}
        setIsVisible={setIsVisible}
      />
    </React.Fragment>
  )
}