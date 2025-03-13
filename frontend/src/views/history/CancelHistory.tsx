import React, { useContext } from 'react'
import SessionStructure from '../../internal/dataAccess/SessionStructure'
import { NavContext } from '../navigator/NavContext'
import { Colors } from '../../theme/Theme'
import CancelHistoryBookingModal from './cancelHistory/CancelHistoryBookingModal'
import { VerticalSpacer } from '../components/ViewElements'
import { BaseTable } from '../components/Tables'
import FromUtcDate from '../../internal/DateAndTime'
import SessionDate from '../../internal/dateAndTime/SessionDate'

export default function CancelHistory() {
  const { contacts, sessions, auditManager } = useContext(NavContext)

  const cancelledBookings = SessionStructure
    .invalidSessions(sessions)
    .filter((s) => s.cancelled_at)
  const orderedSessions = SessionStructure.sortByDate(cancelledBookings)

  return (
    <>
      <VerticalSpacer size={10} />

      <BaseTable
        head={
          <tr>
            <th>ID#</th>
            <th>Date</th>
            <th>Name</th>
            <th>Timeslot</th>
            <th>Charge</th>
            <th>Refund</th>
            <th>Cancelled on</th>
            <th>By</th>
            <th>Reason</th>
            <th></th>
          </tr>
        }
        body={
          <>
            {orderedSessions.map((session) => {
              const user = SessionStructure.owningContact({ session, contacts })
              const displayDate = FromUtcDate(session.date).weekdayString()
              const cancelledDate = FromUtcDate(session.cancelled_at).weekdayString()
              const timeSlot = SessionDate(session).timeLengthString()
              const { charge, refund } = auditManager.chargesForSession(session)
              const cancelledByText = session.cancelled_by_user ? 'Client' : 'You'
              const cancellationReason = session.cancel_reason || session.user_notes

              return (
                <tr key={session._id}>
                  <td>{session._id}</td>
                  <td>{displayDate}</td>
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td>{timeSlot}</td>
                  <td style={{ color: Colors.GREEN }}>${charge}</td>
                  <td style={{ color: Colors.RED_00 }}>${refund}</td>
                  <td>{cancelledDate}</td>
                  <td>{cancelledByText}</td>
                  <td>{cancellationReason}</td>
                  <td>
                    <CancelHistoryBookingModal session={session} />
                  </td>
                </tr>
              )
            })}
          </>
        }
      />
    </>
  )
}