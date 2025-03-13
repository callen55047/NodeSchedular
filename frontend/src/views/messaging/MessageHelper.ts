import {DraftData, MessageStatus} from "./MessagingContext";
import {IMessage} from "../../internal/models/Message";

function getMessageStatus(draftData: DraftData, artist_id: string, thread_id?: string, lastMessage?: IMessage): MessageStatus {
    if (lastMessage && lastMessage.sender_id !== artist_id && !lastMessage.is_read) {
        return "unread"
    }
    if (draftData) {
        if (draftData[thread_id || -1]) {
            return "draft"
        } else {
            // TODO: check for unread message
        }
    }
    return undefined
}

export {
    getMessageStatus
}