import APIClass from "./APIClass";
import {ApiContract} from "../../contracts/ApiContract";
import { IInquiry } from '../../internal/models/Inquiry'

export default class InquiryAPI extends APIClass {
    private url = "inquiry"

    async decision(props: ApiContract.Props.InquiryDecision): Promise<IInquiry | null> {
        try {
            return await this.controller
                .dataTask<IInquiry>(
                    `${this.url}/update/${props.inquiry_id}/`,
                    "patch",
                    {
                        decision: props.decision,
                        artist_notes: props.artist_notes
                    }
                )
        } catch (error) {
            return null
        }
    }
}