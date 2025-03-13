import React, { useContext, useState } from 'react'
import { NavContext } from '../navigator/NavContext'
import { AutoSelectFromList } from '../components/ViewProperties'
import { Tile, TileRowContainer } from '../components/TileLayout'
import { FlexBox, VerticalSplitColumnView } from '../components/view/FlexLayouts'
import { SearchBox } from '../components/ListViewComponents'
import { ContactListDisplay } from '../components/contact/ContactViewComps'
import SessionStructure from '../../internal/dataAccess/SessionStructure'
import { Colors } from '../../theme/Theme'
import { DividerLine, VerticalSpacer } from '../components/ViewElements'
import { BaseText } from '../../theme/CustomText'
import { AuditRecordListItem } from '../components/AuditRecordViewComps'
import SessionDate from '../../internal/dateAndTime/SessionDate'

export default function TransactionAuditPanel() {
  const { transactions, sessions, auditManager } = useContext(NavContext)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedSession = sessions.find((s) => s._id === selectedId)

  const auditRecords = selectedSession ?
    auditManager.getForSession(selectedSession) : []

  AutoSelectFromList(
    sessions,
    selectedId,
    (s) => {
      setSelectedId(s._id)
    }
  )

  return (
    <TileRowContainer>
      <Tile name={'Transaction Auditor'} maxHeight={500}>
        <VerticalSplitColumnView>
          <React.Fragment>
            <SearchBox
              currentValue={''}
              onChange={(text) => {
              }}
            />
            <ContactListDisplay>
              {sessions.map((session) => {
                const date = SessionDate(session)
                const status = SessionStructure.getSessionStatus(session, transactions)
                const dateString = date.localDate.weekdayString()
                const timeslot = date.timeLengthString()
                const isSelected = session._id === selectedId

                return (
                  <button
                    className={'simple-hover'}
                    style={{
                      background: isSelected ? Colors.DARK_RED : Colors.DARK_GREY,
                      borderRadius: 4,
                      border: 'none',
                      marginBottom: 5
                    }}
                    onClick={() => setSelectedId(session._id)}
                  >
                    <FlexBox vertical={true} margin={5}>
                      <FlexBox justify={'flex-start'}>
                        <BaseText
                          text={`ID: ${session._id}`}
                          styles={{ fontWeight: 'bold' }}
                        />
                      </FlexBox>
                      <VerticalSpacer size={5} />
                      <FlexBox justify={'flex-start'}>
                        <BaseText
                          text={`${dateString}, ${timeslot}`}
                          color={Colors.LIGHT_GREY_00}
                        />
                      </FlexBox>
                      <VerticalSpacer size={5} />
                      <FlexBox justify={'flex-start'}>
                        <BaseText
                          text={status}
                          styles={{ fontWeight: 'bold' }}
                          color={Colors.LIGHT_GREY_00}
                        />
                      </FlexBox>
                    </FlexBox>
                  </button>
                )
              })}
            </ContactListDisplay>
          </React.Fragment>

          <React.Fragment>
            <BaseText
              text={'System transactions'}
              size={18}
            />
            <DividerLine />

            {auditRecords.map((record) => {
              return (
                <AuditRecordListItem record={record} />
              )
            })}
          </React.Fragment>
        </VerticalSplitColumnView>
      </Tile>
    </TileRowContainer>
  )
}