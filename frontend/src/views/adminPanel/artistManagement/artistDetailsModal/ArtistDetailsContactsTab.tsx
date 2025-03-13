import React, { useContext, useState } from 'react'
import { ArtistDetailContext } from './ArtistDetailContext'
import { FlexBox } from '../../../components/view/FlexLayouts'
import { IAccount } from '../../../../internal/models/Account'
import { ProfileAvatar } from '../../../images/ImageDisplayViews'
import { HorizontalSpacer, VerticalSpacer } from '../../../components/ViewElements'
import { BaseTable } from '../../../components/Tables'
import LocalImages from '../../../images/LocalImages'
import { SelectionList } from '../../../components/Selectors'
import FromUtcDate from '../../../../internal/DateAndTime'
import InquiryStructure from '../../../../internal/dataAccess/InquiryStructure'
import SessionStructure from '../../../../internal/dataAccess/SessionStructure'
import { EAuditRecordType, objIsIAuditRecord } from '../../../../internal/models/AuditRecord'
import { orderByCreatedAt } from '../../../../internal/ObjectHelpers'
import { objIsIMessage } from '../../../../internal/models/Message'
import { objIsISession } from '../../../../internal/models/Session'
import SessionDate from '../../../../internal/dateAndTime/SessionDate'

export default function ArtistDetailContactsTab() {
  const { artist, details } = useContext(ArtistDetailContext)
  const [selectedContact, setSelectedContact] = useState<IAccount | null>(() => {
    return details.contacts.length > 0 ? details.contacts[0] : null
  })

  const contactOptions = details.contacts.map(c => c.username)
  const threads = details.threads.filter(t => t.user_id === selectedContact?._id).map(t => t._id)
  const messages = details.messages.filter(m => threads.includes(m.thread_id))
  const inquiries = selectedContact ? InquiryStructure.allForContact(details.inquiries, selectedContact) : []
  const sessions = selectedContact ?  SessionStructure.allForContact(details.sessions, selectedContact) : []
  const sessionIds = sessions.map(s => s._id)
  const auditRecords = details.auditRecords.filter(a => {
    return a.type !== EAuditRecordType.INTENT && sessionIds.includes(a.session_id)
  })
  const allItems = [...messages, ...inquiries, ...sessions, ...auditRecords]
  const orderedItems = orderByCreatedAt(allItems)

  return (
    <FlexBox
      vertical={true}
      justify={'flex-start'}
      style={{
        height: 500,
        maxWidth: 1000,
        overflow: 'auto'
      }}
    >
      <FlexBox justify={'flex-start'}>
        <ProfileAvatar
          src={selectedContact?.profile_pic?.url || LocalImages.DEFAULT_AVATAR}
          size={50}
        />
        <HorizontalSpacer size={15} />
        <SelectionList
          options={contactOptions}
          current={selectedContact?.username || ''}
          onSelect={(username) => {
            const contact = details.contacts.find(c => c.username === username)
            setSelectedContact(contact || null)
          }}
        />
      </FlexBox>
      <VerticalSpacer size={10} />
      <BaseTable
        head={
          <tr>
            <th>Created At</th>
            <th>Type</th>
            <th>Value</th>
            <th></th>
          </tr>
        }
        body={
          <>
            {orderedItems.map((item) => {
              // TODO: add enlarged attachment view
              const createdDate = FromUtcDate(item.created_at).fullDateString()

              if (objIsIMessage(item)) {
                const sender = item.sender_id === artist._id ? 'Artist' : 'Client'

                return (
                  <tr key={item._id}>
                    <td>{createdDate}</td>
                    <td style={{color: 'aqua'}}>Message</td>
                    <td>{`${sender} ${!item.is_read ? '[NEW]' : ''} - ${item.body}`}</td>
                    <td>
                      {item.attachments.map(attachment => {
                        return (
                          <img
                            src={attachment.url}
                            alt={`attachment-${attachment._id}`}
                            style={{
                              objectFit: 'cover',
                              width: 25
                            }}
                          />
                        )
                      })}
                    </td>
                  </tr>
                )
              } else if (objIsISession(item)) {
                const status = SessionStructure.getSessionStatus(item, details.transactions)
                const date = SessionDate(item)

                return (
                  <tr key={item._id}>
                    <td>{createdDate}</td>
                    <td style={{ color: 'orange' }}>Session</td>
                    <td>{`${date.localDate.weekdayString()} - ${date.timeLengthString()}`}</td>
                    <td>{status.toUpperCase()}</td>
                  </tr>
                )
              } else if (objIsIAuditRecord(item)) {
                const type = item.type === EAuditRecordType.CONFIRM ? 'Card' : 'Cash'
                const charge = item.charge ? item.charge / 100 : 0

                return (
                  <tr key={item._id}>
                    <td>{createdDate}</td>
                    <td style={{ color: 'green' }}>{type}</td>
                    <td>{`$CA${charge}`}</td>
                    <td></td>
                  </tr>
                )
              }

              return null
            })}
          </>
        }
      />
    </FlexBox>
  )
}