import FromUtcDate from '../DateAndTime'
import { ISession } from '../models/Session'
import moment from 'moment'

/**
 * Session-specific implementation of LocalDate object
 * @public
 */
const SessionDate = (session: ISession) => {
  const nDate = FromUtcDate(session.date, session.start_time)

  return {

    localDate: nDate,

    timeLengthString: () => {
      const startingTime = moment(session.start_time, "HH:mm").format("h:mm")
      const endingTime = moment(session.end_time, "HH:mm").format("h:mm a")
      return `${startingTime} - ${endingTime}`
    },

    hasOverlappingTimeSlot(comparable: ISession): boolean {
      // don't compare against same session
      if (session._id === comparable._id) {
        return false
      }

      const otherSession = SessionDate(comparable)
      if (!nDate.offsetMoment().isSame(otherSession.localDate.offsetMoment(), 'day')) {
        return false
      }

      const myStartTime = session.start_time
      const myEndTime = session.end_time
      const otherStartTime = comparable.start_time
      const otherEndTime = comparable.end_time

      return (
        (myStartTime.localeCompare(otherStartTime) <= 0 && myEndTime.localeCompare(otherStartTime) >= 0) ||
        (otherStartTime.localeCompare(myEndTime) <= 0 && otherEndTime.localeCompare(myStartTime) >= 0)
      )
    }

  }
}

export default SessionDate
