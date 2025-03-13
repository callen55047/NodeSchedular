import {IInquiry} from "../../../internal/models/Inquiry";
import { removeDuplicatesBasedOnUpdatedAt } from '../../../internal/ObjectHelpers'

type InquiryState = IInquiry[]
type InquiryAction = {
    type: "UPDATE_LIST",
    list: IInquiry[],
}

function InquiryReducer(state: InquiryState, action: InquiryAction): InquiryState {
    const { type, list } = action

    switch (type) {
        case "UPDATE_LIST":
            return removeDuplicatesBasedOnUpdatedAt([...state, ...list])
        default:
            return state
    }
}

export {
    InquiryReducer,
    InquiryState,
    InquiryAction
}