import ApiController from "../ApiController";

export default class APIClass {
    protected controller: ApiController

    constructor(controller: ApiController) {
        this.controller = controller
    }
}