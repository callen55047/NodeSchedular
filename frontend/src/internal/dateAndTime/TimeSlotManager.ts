import { ETimeSlotIncrements, IArtistSettings } from '../models/settings/ArtistSettings'
import { ISession } from '../models/Session'
import moment from 'moment/moment'
import SessionStructure from '../dataAccess/SessionStructure'
import { DAILY_TIME_OPTIONS } from '../InputOptions'
import { DATE_FORMAT } from './DateConstants'


interface IButtonTimeSlot {
  start_time: string,
  is_available: boolean
}

const TimeSlotManager = {

  getWorkingHourTimeSlots: (settings: IArtistSettings): string[] => {
    return DAILY_TIME_OPTIONS
      .filter((slot) => {
        return slot.localeCompare(settings.daily_work_hours.start_time) >= 0 &&
          slot.localeCompare(settings.daily_work_hours.end_time) <= 0
      })
  },

  getAvailableTimeSlotsWithSessions: (timeSlots: string[], sessions: ISession[]): string[] => {
    return timeSlots
      .filter((slot) => {
        const conflictingSessionSlots = sessions.filter((session) => {
          return slot.localeCompare(session.start_time) >= 0 &&
            slot.localeCompare(session.end_time) < 0
        })

        return conflictingSessionSlots.length < 1
      })
  },

  getNewSessionStartEndTime: (settings: IArtistSettings, sessions: ISession[], date: moment.Moment): {
    start_time: string,
    end_time: string
  } => {
    const { daily_work_hours, default_booking_length } = settings

    let newStartTime = daily_work_hours.start_time
    let newEndTime = TimeSlotManager.getEndTime(newStartTime, default_booking_length)

    const sessionsToday = SessionStructure.sessionsForDate(sessions, date)
    for (const session of sessionsToday) {
      if (newEndTime <= session.start_time) {
        // valid time slot
        break
      } else {
        newStartTime = session.end_time
        newEndTime = TimeSlotManager.getEndTime(newStartTime, default_booking_length)
      }
    }

    return {
      start_time: newStartTime,
      end_time: newEndTime
    }
  },

  getDefaultStartEndTime: (settings: IArtistSettings): { start_time: string, end_time: string } => {
    const timeslots = TimeSlotManager.getWorkingHourTimeSlots(settings)
    const start_time = timeslots[0]
    const targetEndTime = timeslots.find((t) => t === start_time + settings.default_booking_length)
    const end_time = targetEndTime || timeslots[2]
    return { start_time, end_time }
  },

  getEndTime: (start_time: string, length: number): string => {
    const [startingHour, startingMinute] = start_time.split(':')
    const endingHour = Math.min(Number(startingHour) + Number(length), 23)
    return `${endingHour}:${startingMinute}`
  },

  getStartingTimeSlots: (settings: IArtistSettings, sessions: ISession[], date: moment.Moment): string[] => {
    const sessionsForDay = SessionStructure.sessionsForDate(sessions, date)
    const workingHourSlots = TimeSlotManager.getWorkingHourTimeSlots(settings)
    return TimeSlotManager.getAvailableTimeSlotsWithSessions(workingHourSlots, sessionsForDay)
  },

  getEndingTimeSlots: (timeSlots: string[], start_time: string): string[] => {
    return timeSlots.filter((slot) => {
      return slot.localeCompare(start_time) >= 0
    })
  },

  buildButtonTimeSlots: (settings: IArtistSettings, sessions: ISession[], date: moment.Moment): IButtonTimeSlot[] => {
    let division: number = 1
    if (settings.time_slot_increments === ETimeSlotIncrements.HALF) {
      division = 2
    } else if (settings.time_slot_increments === ETimeSlotIncrements.HOUR) {
      division = 4
    }

    const sessionsForDay = SessionStructure.sessionsForDate(sessions, date)
    const workingHourSlots = TimeSlotManager.getWorkingHourTimeSlots(settings)
    const availableSlots = TimeSlotManager.getAvailableTimeSlotsWithSessions(workingHourSlots, sessionsForDay)
    return workingHourSlots
      .filter((_, index) => index % division === 0)
      .map((slot) => ({ start_time: slot, is_available: availableSlots.includes(slot) }))
  },

  buildDateListOptions: (date: moment.Moment): string[] => {
    return Array.from({length: 15}, (_, index) => {
      return date.clone()
        .subtract(5, 'days')
        .add(index, 'days')
        .format(DATE_FORMAT.weekDayWithYear)
    })
  }
}

export {
  IButtonTimeSlot
}

export default TimeSlotManager