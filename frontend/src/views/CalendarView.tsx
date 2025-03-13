import React, { useContext, useState } from 'react'
import { Tile, TileRowContainer } from './components/TileLayout'
import { CalendarContext } from './calendarView/CalendarContext'
import BookingsModal from './calendarView/BookingsModal'
// @ts-ignore
import Calendar from 'react-awesome-calendar'
import { NavContext } from './navigator/NavContext'
import SessionStructure from '../internal/dataAccess/SessionStructure'

export default function CalendarView() {
  const { sessions, contacts } = useContext(NavContext)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const calendarRef = React.createRef()

  function onDateChange(value: any) {
    setSelectedDate(value as Date)
  }

  function onEventClicked(id: string) {
    setSelectedBooking(id)
  }

  // calendarView event structure
  // {
  //     id: 1,
  //     color: '#fd3153',
  //     from: '2023-05-02T18:00:00+00:00',
  //     to: '2023-05-05T19:00:00+00:00',
  //     title: 'This is an event'
  // }

  const calendarEvents = sessions.map((session) => {
    const contact = SessionStructure.owningContact({ session, contacts })

    return {
      id: session._id,
      color: '#3694DF',
      from: session.start_time,
      to: session.end_time,
      title: `${contact.first_name} ${contact.last_name}`
    }
  })

  // TODO: calendarView is logging every event change to the console
  const contextObj = {
    selectedBooking,
    setSelectedBooking
  }
  return (
    <CalendarContext.Provider value={contextObj}>
      <TileRowContainer>
        <Tile>
          <Calendar
            ref={calendarRef}
            events={calendarEvents}
            mode={'monthlyMode'}
            onClickEvent={onEventClicked}
            onChange={(e: any) => {
            }}
            onClickTimeLine={(e: any) => {
            }}
          />
        </Tile>
      </TileRowContainer>

      <BookingsModal
        isActive={selectedBooking !== null}
        closeModal={() => setSelectedBooking(null)}
      />
    </CalendarContext.Provider>
  )
}