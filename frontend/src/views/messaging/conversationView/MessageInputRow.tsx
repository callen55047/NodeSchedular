import React, { FormEvent, useContext, useState } from 'react'
import { Colors, FontSizes } from '../../../theme/Theme'
import { DynamicSpacer, Icon } from '../../components/ViewElements'
import { ConversationButton, MessageAttachmentPill } from './ConversationViewComps'
import BookSessionModal from '../../components/modal/BookSessionModal'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { NavContext } from '../../navigator/NavContext'
import { MessagingContext } from '../MessagingContext'
import FileInputWrapper from '../../components/FileInputWrapper'
import { EMetaType } from '../../../internal/models/File'
import { SimpleButton } from '../../components/Buttons'
import { NAVIGATOR_VIEWS } from '../../navigator/INavigatorView'

export default function MessageInputRow() {
  const { runBlocking, api } = useContext(AppInstance)
  const { sessions, requestNewComponent, messageDispatch } = useContext(NavContext)
  const {
    thread,
    contact,
    draftData,
    setDraftData
  } = useContext(MessagingContext)
  const [attachments, setAttachments] = useState<File[]>([])

  if (!thread) {
    return null
  }

  const currentText = draftData[thread!._id] || ''
  const hasActiveBooking = !!sessions.find((b) => b.user_id === contact?._id)

  function updateDraftText(body: string) {
    if (body === '') {
      resetDraftData()
    } else {
      setDraftData({ ...draftData, [thread!._id]: body })
    }
  }

  function resetDraftData() {
    setAttachments([])
    const newData = { ...draftData }
    delete newData[thread!._id]
    setDraftData(newData)
  }

  function onFileSelection(files: FileList | null) {
    if (!files || attachments.length > 1) {
      return
    }

    const newAttachments = [...attachments, ...files]
    setAttachments(newAttachments)
  }

  function removeFile(file: File) {
    const filesWithoutTarget = attachments.filter((att) => {
      return att.name !== file.name
    })
    setAttachments([...filesWithoutTarget])
  }

  function submitUserMessage(e: FormEvent) {
    e.preventDefault()
    if (currentText === '' && attachments.length === 0) {
      return
    }

    runBlocking(async () => {
      const attachmentIds: string[] = []

      const uploadedImages = await api.file.uploadAll({
        type: EMetaType.MESSAGE,
        files: attachments
      })
      if (uploadedImages) {
        uploadedImages.files.forEach((file) => {
          attachmentIds.push(file._id)
        })
      }

      const serverMessage = await api.threads.sendMessage({
        thread_id: thread!._id,
        body: currentText,
        attachments: attachmentIds
      })
      if (serverMessage && serverMessage.created_at) {
        messageDispatch({
          type: 'APPEND',
          list: [serverMessage]
        })
        resetDraftData()
      }
    })
  }

  function jumpToBookingsPage() {
    requestNewComponent(
      {
        ...NAVIGATOR_VIEWS.BOOKINGS,
        params: {
          user_id: contact?._id
        }
      }
    )
  }

  return (
    <div style={{
      minHeight: 40,
      background: Colors.LIGHT_GREY_00,
      borderTop: '1px solid black',
      display: 'flex',
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    }}>
      <form onSubmit={submitUserMessage} style={{ display: 'flex', flex: 10 }}>
        <input
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: FontSizes.f14,
            color: 'white',
            flex: 10,
            margin: 10
          }}
          placeholder={'Aa...'}
          value={currentText}
          onChange={(e) => updateDraftText(e.target.value)}
        />
      </form>
      <DynamicSpacer size={1} />

      {attachments.map((att) => {
        return (
          <MessageAttachmentPill
            file={att}
            deleteAction={() => removeFile(att)}
          />
        )
      })}

      <BookSessionModal contact={contact!} thread={thread}>
        <SimpleButton
          theme={"SUCCESS"}
          text={"Create session"}
          icon={"fa-calendar-plus-o"}
          action={() =>{}}
          slim={true}
          collapsable={true}
        />
      </BookSessionModal>

      {hasActiveBooking &&
        <ConversationButton
          onSend={jumpToBookingsPage}
          background={'transparent'}
          foreground={Colors.BLUE_00}
          icon={'fa-share-square-o'}
          corners={'all'}
          hint={'Go to booked sessions'}
        />
      }

      {/*Only allow a single attachment for now*/}
      {attachments.length < 1 &&
        <FileInputWrapper onFileSelection={onFileSelection}>
          <Icon
            name={'fa-paperclip'}
            margin={10}
            rSize={1.4}
            onClick={() => {
            }}
          />
      </FileInputWrapper>
      }

      <ConversationButton
        onSend={submitUserMessage}
        background={Colors.BLUE_00}
        icon={'fa-paper-plane'}
        corners={'left'}
      />
    </div>
  )
}