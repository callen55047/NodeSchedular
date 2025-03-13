import moment from 'moment-timezone'

interface ILocalized {
  timezoneOffset: () => string
}

class Localized implements ILocalized {
  private readonly _timezoneOffset: string

  constructor() {
    this._timezoneOffset = moment().format('Z')
  }

  timezoneOffset() {
    return this._timezoneOffset
  }
}

export {
  ILocalized
}

export default Localized