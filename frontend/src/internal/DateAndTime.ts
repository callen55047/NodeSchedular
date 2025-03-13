import moment, { Moment } from 'moment/moment'
import Core from './Core'
import { DATE_FORMAT } from './dateAndTime/DateConstants'

class NDate {
  private readonly date: Moment

  constructor(date: Moment) {
    this.date = date
  }

  /**
   * Returns current date object with the offset of the device
   * use this for displaying dates in UI
   * But always send dates to server in UTC format without offset
   * @private
   */
  offsetMoment(): Moment {
    return this.date.utcOffset(Core.localized.timezoneOffset())
  }

  utcMoment(): Moment {
    return this.date
  }

  toOffsetDate(): Date {
    return this.offsetMoment().toDate()
  }

  toUtcDate(): Date {
    return this.date.toDate()
  }

  add(amount: number, unit: moment.unitOfTime.DurationConstructor): NDate {
    this.date.add(amount, unit)
    return this
  }

  hourString(): string {
    return this.offsetMoment().format('h:mm A')
  }

  weekdayTimestampString(): string {
    return this.offsetMoment().format('dddd, MMM D, h:mm A')
  }

  weekdayString(): string {
    return this.offsetMoment().format('dddd, MMM D')
  }

  fullDateString(): string {
    return this.offsetMoment().format('M/D/YY h:mm A')
  }

  dashCase(): string {
    return this.date.format('YYYY-MM-DD')
  }

  utcString(): string {
    return this.date.format()
  }

  localDashCase(): string {
    return this.offsetMoment().format('YYYY-MM-DD')
  }

  isBeforeRightNow(): boolean {
    return this.date.isBefore(moment().utc())
  }

  isAfterRightNow(): boolean {
    return this.date.isAfter(moment().utc())
  }

  weekdayWithYearString(): string {
    return this.date.format(DATE_FORMAT.weekDayWithYear)
  }

  daysPastString(): string {
    const now = new Date()
    const createdAt = this.toOffsetDate()
    const diffInMs = now.getTime() - createdAt.getTime()

    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    return `${days} days ago`
  }
}

/**
 * Implementation of NDate class
 * Handles creating instances from utc format
 * @public
 */
const FromUtcDate = (dateString?: string, timeString?: string): NDate => {

  const m = moment.utc(dateString)
  if (timeString) {
    const parts = timeString.split(':')
    const hour = Number(parts[0]), minute = Number(parts[1])
    m.set('hour', hour)
    m.set('minute', minute)
  }
  return new NDate(m)
}

/**
 * Implementation of NDate class
 * Handles creating instances from utc a local offset source
 * @public
 */
const CreateUtcDate = (dateString: string): NDate => {
  return new NDate(moment(dateString))
}

export {
  CreateUtcDate
}

export default FromUtcDate