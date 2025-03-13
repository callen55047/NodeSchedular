import APIClass from "./APIClass";
import {ApiContract} from "../../contracts/ApiContract";
import {IMessage} from "../../internal/models/Message";

export default class ThreadsAPI extends APIClass {
    private url = "message"

    async sendMessage(props: ApiContract.Props.SendContactMessage): Promise<IMessage | null> {
        try {
            return await this.controller
                .dataTask<IMessage>(
                    `${this.url}/create/`,
                    "post",
                    {...props}
                )
        } catch (error) {
            console.log('error creating message', error);
            return null
        }
    }

    async markMessagesAsRead(thread_id: string): Promise<ApiContract.Response.Success | null> {
        try {
            return await this.controller
                .dataTask<ApiContract.Response.Success>(
                    `${this.url}/thread/read/`,
                    "patch",
                    {thread_id}
                )
        } catch (error) {
            console.log('error marking thread as read', error);
            return null
        }
    }
}