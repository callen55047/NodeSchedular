import { createContext } from 'react'
import { ISession } from '../../internal/models/Session'

interface IBookingContext {
  selectedSessionId: string | null,
  setSelectedSessionId: (newId: string | null) => void,
  filteredSessions: ISession[]
}

export const BookingContext = createContext<IBookingContext>({} as IBookingContext)