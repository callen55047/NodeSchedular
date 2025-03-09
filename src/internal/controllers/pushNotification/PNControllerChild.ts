import { PNController } from '../PushNotification.js'

export default class PNControllerChild {
  controller: PNController

  constructor(controller: PNController) {
    this.controller = controller
  }
}