import {createContext, Dispatch} from "react";
import {IThread} from "../../internal/models/Thread";
import {InquiryAction} from "./reducers/InquiryListReducer";
import {ISession} from "../../internal/models/Session";
import {SessionsAction} from "./reducers/BookedSessionsReducer";
import {ITransaction} from "../../internal/models/Transaction";
import {IInquiry} from "../../internal/models/Inquiry";
import { IAccount } from '../../internal/models/Account'
import { IMessage } from '../../internal/models/Message'
import { ContactAction } from './reducers/ContactReducer'
import { ThreadAction } from './reducers/ThreadReducer'
import { MessageAction } from './reducers/MessageReducer'
import {TransactionAction} from "./reducers/TransactionsReducer";
import { IFileStateManager } from '../../internal/state/FileStateManager'
import { IAuditStateManager } from '../../internal/state/AuditStateManager'
import { INavNotification } from './NavNotifications'
import { INavigatorView } from './INavigatorView'

interface INavContext {
    currentView: INavigatorView,
    requestNewComponent: (comp: INavigatorView) => void,
    setHasViewSpecificWork: (newState: boolean) => void,

    contacts: IAccount[],
    threads: IThread[],
    messages: IMessage[],
    inquiries: IInquiry[],
    sessions: ISession[],
    transactions: ITransaction[],

    contactDispatch: Dispatch<ContactAction>,
    threadDispatch: Dispatch<ThreadAction>,
    messageDispatch: Dispatch<MessageAction>,
    inquiryDispatch: Dispatch<InquiryAction>,
    sessionDispatch: Dispatch<SessionsAction>,
    transactionDispatch: Dispatch<TransactionAction>

    fileManager: IFileStateManager
    auditManager: IAuditStateManager,
    getNotifications: (view: INavigatorView) => INavNotification
}

export const NavContext = createContext<INavContext>({} as INavContext)