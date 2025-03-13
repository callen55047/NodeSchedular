import { createTempId } from '../Identification'
import FromUtcDate from '../DateAndTime'
import { IArtistSettings } from './settings/ArtistSettings'
import TimeSlotManager from '../dateAndTime/TimeSlotManager'

interface ISubSession {
  date: string,
  start_time: string,
  end_time: string,
}

interface ISession {
  _id: string,
  thread_id: string,
  user_id: string,
  artist_id: string,
  location: string | null,
  description: string,
  artist_notes: string,
  user_notes: string,
  date: string,
  start_time: string,
  end_time: string,
  sub_sessions: ISubSession[],
  deposit: number,
  price: number,
  includes_tax: boolean,
  rejected_at?: string,
  cancelled_at?: string,
  cancel_reason?: string,
  cancelled_by_user: boolean,
  artist_completed_at?: string,
  created_at: string,
  updated_at: string,

  // local properties
  has_conflict?: boolean,
}

const createLocalSession = (
  artist_id: string,
  start_time: string,
  end_time: string,
  deposit: number,
  price: number,
  includes_tax: boolean
): ISession => {
  const utcDateString = FromUtcDate().localDashCase()

  return {
    _id: createTempId(),
    thread_id: '',
    user_id: '',
    artist_id,
    location: '',
    description: '',
    artist_notes: '',
    user_notes: '',
    date: utcDateString,
    start_time,
    end_time,
    sub_sessions: [],
    deposit,
    price,
    includes_tax,
    cancelled_by_user: false,
    created_at: utcDateString,
    updated_at: utcDateString
  }
}

const createSubSession = (
  settings: IArtistSettings
): ISubSession => {
  const { start_time, end_time } = TimeSlotManager.getDefaultStartEndTime(settings)

  return {
    date: FromUtcDate().localDashCase(),
    start_time,
    end_time
  }
}

enum ESessionStatus {
  PENDING = 'Pending',
  UPCOMING = 'Upcoming',
  TATTOO_COMPLETE = 'Tattoo Complete',
  COMPLETED = 'Completed',
  DISPUTED = 'Disputed',
  INVALID = 'Invalid'
}

function objIsISession(obj: any): obj is ISession {
  return obj.hasOwnProperty('start_time') &&
    obj.hasOwnProperty('end_time')
}

export {
  ISession,
  ISubSession,
  createLocalSession,
  createSubSession,
  ESessionStatus,
  objIsISession
}