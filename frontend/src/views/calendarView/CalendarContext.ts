import { createContext } from 'react'

interface ICalendarContext {
  selectedBooking: string | null,
  setSelectedBooking: (newId: string | null) => void
}

export const CalendarContext = createContext<ICalendarContext>({} as ICalendarContext)