import React, { useContext } from 'react'
import SessionStructure from '../../internal/dataAccess/SessionStructure'
import { NavContext } from '../navigator/NavContext'
import { BaseTable } from '../components/Tables'
import { VerticalSpacer } from '../components/ViewElements'
import FromUtcDate from '../../internal/DateAndTime'
import SessionDate from '../../internal/dateAndTime/SessionDate'

export default function RejectedHistory() {
  const { contacts, sessions } = useContext(NavContext)

  const rejectedSessions = SessionStructure
    .invalidSessions(sessions)
    .filter((s) => s.rejected_at)
  const orderedSessions = SessionStructure.sortByDate(rejectedSessions)

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
            <th>Price</th>
            <th>Deposit</th>
            <th>Rejected on</th>
            <th>Reason</th>
          </tr>
        }
        body={
          <>
            {orderedSessions.map((session) => {
              const user = SessionStructure.owningContact({ session, contacts })
              const displayDate = FromUtcDate(session.date).weekdayString()
              const cancelledDate = FromUtcDate(session.rejected_at).weekdayString()
              const timeSlot = SessionDate(session).timeLengthString()

              return (
                <tr key={session._id}>
                  <td>{session._id}</td>
                  <td>{displayDate}</td>
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td>{timeSlot}</td>
                  <td>${session.price}</td>
                  <td>${session.deposit}</td>
                  <td>{cancelledDate}</td>
                  <td>{session.user_notes}</td>
                </tr>
              )
            })}
          </>
        }
      />
    </>
  )
}