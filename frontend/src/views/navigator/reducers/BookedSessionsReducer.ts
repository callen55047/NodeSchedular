import {ISession} from "../../../internal/models/Session";
import { removeDuplicatesBasedOnUpdatedAt } from '../../../internal/ObjectHelpers'

type SessionState = ISession[]
type SessionsAction = {
    type: "APPEND_LIST" | "OVERWRITE" | "NEW_BOOKING" | "UPDATE_BOOKING" | "DELETE_BOOKING",
    list?: ISession[],
    session?: ISession
}

function SessionReducer(state: SessionState, action: SessionsAction): SessionState {
    const { type, list, session } = action

    switch (type) {
        case "APPEND_LIST":
            return removeDuplicatesBasedOnUpdatedAt([...state, ...list!])
        case "OVERWRITE":
            return [...list!]
        case "NEW_BOOKING":
            const listWithNewBooking = [...state]
            listWithNewBooking.push(session!)
            return listWithNewBooking
        case "UPDATE_BOOKING":
            const listWithoutTargetBooking = [...state].filter((b) => b._id !== session?._id)
            return [...listWithoutTargetBooking, session!]
        case "DELETE_BOOKING":
            return [...state].filter((b) => b._id !== session?._id)
        default:
            return state
    }
}

export {
    SessionReducer,
    SessionState,
    SessionsAction,
}