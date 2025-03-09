import moment from 'moment'

const oneDayLength = 24 * 60 * 60 * 1000

const DateManager = {

  oneDay: oneDayLength,
  sevenDays: oneDayLength * 7,
  beginningOfTime: '2013-09-13T00:00:00Z',

  isDateOlderThan: (date: Date, length: number): boolean => {
    const currentDate = new Date()
    const differenceInMilliseconds = currentDate.getTime() - date.getTime()
    return differenceInMilliseconds > length
  },

  dayMonthString: (date: Date): string => {
    return moment(date).format("dddd, MMM D")
  },

  normalizedDayDateString: (date: Date) => {
    const m = moment.utc(date)
    return m.format('dddd, MMM D')
  }

}

export default DateManager