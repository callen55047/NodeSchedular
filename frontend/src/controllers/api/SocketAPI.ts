import APIClass from "./APIClass";
import {ApiContract} from "../../contracts/ApiContract";

export default class SocketAPI extends APIClass {
    private url = "data-fetch"

    async dataFetchUpdate(timestamp: string): Promise<ApiContract.Response.SocketGroupedData | null> {
        return await this.controller
          .dataTask<ApiContract.Response.SocketGroupedData>(
            `${this.url}/artist/update`,
            "post",
            {timestamp}
          )
    }
}