import Localized, { ILocalized } from './coreRegistry/Localized'

class Core {
  static localized: ILocalized

  static register() {
    this.localized = new Localized()
  }
}

export default Core