import React, { Reducer, useContext, useEffect, useReducer, useState } from 'react'
import {
  NavBodyContainer,
  NavButtonMenu,
  NavContainer,
  NavScrollableContainer
} from './navigator/NavViewComps'
import { INavigatorView, NAVIGATOR_VIEWS, parseNavigatorView } from './navigator/INavigatorView'
import { NavContext } from './navigator/NavContext'
import { AppInstance } from '../appEntry/appContainer/AppContext'
import { BeforeUnloadNavModal } from './components/Modal'
import { IBeforeNavigatorUnload, SetWarningForLeavingPage } from './navigator/BeforeUnloadEvent'
import SocketController from '../controllers/SocketController'
import FromUtcDate from '../internal/DateAndTime'
import { InquiryAction, InquiryReducer, InquiryState } from './navigator/reducers/InquiryListReducer'
import { SessionReducer, SessionsAction, SessionState } from './navigator/reducers/BookedSessionsReducer'
import { ContactAction, ContactReducer, ContactState } from './navigator/reducers/ContactReducer'
import { ThreadAction, ThreadReducer, ThreadState } from './navigator/reducers/ThreadReducer'
import { MessageAction, MessageReducer, MessageState } from './navigator/reducers/MessageReducer'
import { TransactionAction, TransactionReducer, TransactionState } from './navigator/reducers/TransactionsReducer'
import FileStateManager from '../internal/state/FileStateManager'
import AuditStateManager from '../internal/state/AuditStateManager'
import { INavNotification } from './navigator/NavNotifications'
import InquiryStructure from '../internal/dataAccess/InquiryStructure'
import SessionStructure from '../internal/dataAccess/SessionStructure'
import { ESessionStatus } from '../internal/models/Session'
import NavigatorViewSwitch from './navigator/NavigatorViewSwitch'
import NavigatorHeader from './navigator/NavigatorHeader'

export default function Navigator() {
  const { currentUser, api, runBlocking, settingsManager, sessionExpired } = useContext(AppInstance)
  const [currentView, setCurrentView] = useState<INavigatorView>(
    () => parseNavigatorView(settingsManager.artistSettings.portal_start_page)
  )
  const [beforeUnloadEvent, setBeforeUnloadEvent] = useState<IBeforeNavigatorUnload>({
    hasViewSpecificWork: false,
    modalIsActive: false,
    requestedView: null
  })

  // CORE data
  const [contacts, contactDispatch] =
    useReducer<Reducer<ContactState, ContactAction>>(ContactReducer, [])
  const [threads, threadDispatch] =
    useReducer<Reducer<ThreadState, ThreadAction>>(ThreadReducer, [])
  const [messages, messageDispatch] =
    useReducer<Reducer<MessageState, MessageAction>>(MessageReducer, [])
  const [inquiries, inquiryDispatch] =
    useReducer<Reducer<InquiryState, InquiryAction>>(InquiryReducer, [])
  // TODO: create sessionStateManager class
  const [sessions, sessionDispatch] =
    useReducer<Reducer<SessionState, SessionsAction>>(SessionReducer, [])
  const [transactions, transactionDispatch] =
    useReducer<Reducer<TransactionState, TransactionAction>>(TransactionReducer, [])
  const fileManager = FileStateManager()
  const auditManager = AuditStateManager()

  useEffect(() => {
    runBlocking(async () => {
      await updateHandler()
    })

    fileManager.fetchAllRemoteFiles()

    // before unload event cancel any loading task
    return () => {
      clearInterval(SocketController.timeoutHandle)
      SocketController.isCancelled = true
    }
  }, [])

  useEffect(() => {
    resetUpdateHandler()
  }, [api])

  async function resetUpdateHandler() {
    clearInterval(SocketController.timeoutHandle)
    SocketController.timeoutHandle = setInterval(
      updateHandler,
      SocketController.getFrequency()
    )
  }

  // BeforeUnloadEvent --------------------------
  function setHasViewSpecificWork(newState: boolean) {
    if (newState !== beforeUnloadEvent.hasViewSpecificWork) {
      setBeforeUnloadEvent({
        ...beforeUnloadEvent,
        hasViewSpecificWork: newState
      })
      SetWarningForLeavingPage(newState)
    }
  }

  function requestNewComponent(newComp: INavigatorView) {
    // ignore same page clicks
    if (newComp.name === currentView.name) {
      return
    }
    if (!beforeUnloadEvent.hasViewSpecificWork) {
      setCurrentView(newComp)
      return
    }
    setBeforeUnloadEvent({
      ...beforeUnloadEvent,
      modalIsActive: true,
      requestedView: newComp
    })
  }

  function onCommitComponentChange() {
    setCurrentView(beforeUnloadEvent.requestedView!)
    setBeforeUnloadEvent({
      hasViewSpecificWork: false,
      modalIsActive: false,
      requestedView: null
    })
  }

  function getNotifications(view: INavigatorView): INavNotification {
    let count = 0

    switch (view) {
      case NAVIGATOR_VIEWS.INQUIRIES:
        count = InquiryStructure.buildActiveInquiries(inquiries).length
        break
      case NAVIGATOR_VIEWS.MESSAGING:
        count = messages
          .filter((m) => m.sender_id !== currentUser!._id && !m.is_read)
          .length
        break
      case NAVIGATOR_VIEWS.BOOKINGS:
        count = SessionStructure
          .getSessionsByStatus(sessions, transactions, [ESessionStatus.UPCOMING])
          .length
    }

    return { view, count }
  }

  // ------------------------------------------

  // SOCKET CONNECTION
  async function updateHandler() {
    if (
      !SocketController.isCancelled &&
      SocketController.status === 'READY' &&
      !sessionExpired
    ) {
      SocketController.status = 'PROCESSING'

      // TODO: convert API controller into a static instance
      const data = await api.socket.dataFetchUpdate(SocketController.lastSyncTime)

      if (SocketController.hasNewSocketData(data)) {
        const { contacts, threads, messages, inquiries, sessions, transactions, auditRecords } = data!

        contactDispatch({ type: 'APPEND', list: contacts })
        threadDispatch({ type: 'APPEND', list: threads })
        messageDispatch({ type: 'APPEND', list: messages })
        inquiryDispatch({ type: 'UPDATE_LIST', list: inquiries })
        sessionDispatch({ type: 'APPEND_LIST', list: sessions })
        transactionDispatch({ type: 'OVERWRITE', list: transactions })
        auditManager.update(auditRecords)

        // only update lastSyncTime if we've received new data
        SocketController.lastSyncTime = FromUtcDate().utcString()
      }

      SocketController.status = 'READY'
    }
  }

  const contextObj = {
    currentView,
    requestNewComponent,
    setHasViewSpecificWork,
    contacts,
    threads,
    messages,
    sessions,
    inquiries,
    transactions,
    contactDispatch,
    threadDispatch,
    messageDispatch,
    sessionDispatch,
    inquiryDispatch,
    transactionDispatch,
    fileManager,
    auditManager,
    getNotifications
  }

  return (
    <NavContext.Provider value={contextObj}>
      <NavContainer>

        <NavigatorHeader />

        <NavBodyContainer>
          <NavButtonMenu
            currentView={currentView}
            setNewComponent={requestNewComponent}
          />

          <NavScrollableContainer>
            <NavigatorViewSwitch view={currentView} />
          </NavScrollableContainer>

        </NavBodyContainer>
      </NavContainer>

      <BeforeUnloadNavModal
        currentView={currentView}
        isActive={beforeUnloadEvent.modalIsActive}
        setIsActive={(newState) =>
          setBeforeUnloadEvent({ ...beforeUnloadEvent, modalIsActive: newState })
        }
        onContinue={onCommitComponentChange}
      />
    </NavContext.Provider>
  )
}
