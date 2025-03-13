import React, { useContext, useState } from 'react'
import { FullScreenTile, TileHeading3, TileMultiSelection } from './components/TileLayout'
import { NavContext } from './navigator/NavContext'
import { FlexBox } from './components/view/FlexLayouts'
import { AutoSelectFromList, ListenForUserId, TViewProps } from './components/ViewProperties'
import { ESessionStatus, ISession } from '../internal/models/Session'
import { DynamicSpacer, VerticalSpacer } from './components/ViewElements'
import SessionStructure from '../internal/dataAccess/SessionStructure'
import { MultiLabelSwitch } from './components/Switches'
import { BookingContext } from './bookings/BookingContext'
import { SideListSelectionView } from './components/view/ListSelectionLayout'
import { FilterButton, SearchBox } from './components/ListViewComponents'
import { BookingContactCard, ContactListDisplay } from './components/contact/ContactViewComps'
import { BaseText } from '../theme/CustomText'
import { ListFilterState } from '../internal/state/ListFilterState'
import { Colors } from '../theme/Theme'
import BookingPanelSelectionView from './bookings/BookingPanelSelectionView'
import FromUtcDate from '../internal/DateAndTime'

interface IBookingFilter {
  pending: boolean,
  upcoming: boolean
}

export default function Bookings(props: TViewProps) {
  const { sessions, transactions, contacts } = useContext(NavContext)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState({} as IBookingFilter)
  const [{ search }, updateSearch] = ListFilterState()

  const filteredWithSearch = getFilteredSessionsFromSearch()
  const booking = filteredWithSearch.find((s) => s._id === selectedSessionId)
  const sessionsGroupedByDate = SessionStructure.groupByDate(filteredWithSearch)

  ListenForUserId(props, (user_id) => {
    const firstSessionId = sessions.find((b) => b.user_id === user_id)?._id
    setSelectedSessionId(firstSessionId || null)
  })

  AutoSelectFromList(
    filteredWithSearch,
    selectedSessionId,
    (s) => {
      setSelectedSessionId(s._id)
    }
  )

  function getFilteredSessionsFromSearch(): ISession[] {
    const states = []
    if (activeFilters.pending) { states.push(ESessionStatus.PENDING) }
    if (activeFilters.upcoming) { states.push(ESessionStatus.UPCOMING) }

    const filteredSessions = SessionStructure.getSessionsByStatus(
      sessions,
      transactions,
      states.length > 0 ? states : [ESessionStatus.PENDING, ESessionStatus.UPCOMING]
    )

    return filteredSessions.filter((s) => {
      if (search !== '') {
        const owningContact = SessionStructure.owningContact({ session: s, contacts })
        const name = `${owningContact.first_name} ${owningContact.last_name}`.toLowerCase()
        if (!name.includes(search.toLowerCase())) {
          return false
        }
      }
      return true
    })
  }

  const contextData = {
    selectedSessionId,
    setSelectedSessionId,
    filteredSessions: filteredWithSearch
  }

  return (
    <FullScreenTile>
      <BookingContext.Provider value={contextData}>
        <SideListSelectionView
          title={"Select booking"}
          ItemListView={
            <React.Fragment>
              <SearchBox
                currentValue={search}
                onChange={updateSearch}
              />
              <VerticalSpacer size={8} />
              <FlexBox style={{marginBottom: 8}}>
                <FilterButton
                  text={'Pending'}
                  isActive={activeFilters.pending}
                  onChange={(state) => setActiveFilters({ ...activeFilters, pending: state })}
                />
                <DynamicSpacer size={1} />
                <FilterButton
                  text={'Upcoming'}
                  isActive={activeFilters.upcoming}
                  onChange={(state) => setActiveFilters({ ...activeFilters, upcoming: state })}
                />
              </FlexBox>
              <ContactListDisplay>
                {Object.entries(sessionsGroupedByDate).map(([date, sessions]) => {
                  const displayDate = FromUtcDate(date).weekdayString()
                  const byTimeSlotSessions = SessionStructure.prepareSessionsByStartTime(sessions)

                  return (
                    <React.Fragment>
                      <BaseText
                        text={displayDate}
                        styles={{ margin: 5, fontWeight: 'bold' }}
                      />
                      {byTimeSlotSessions.map((session) => {
                        return <BookingContactCard
                          session={session}
                          isSelected={session._id === selectedSessionId}
                          hasError={!!session.has_conflict}
                          handleOnClick={setSelectedSessionId}
                        />
                      })}
                    </React.Fragment>
                  )
                })}
              </ContactListDisplay>
            </React.Fragment>
          }
          ItemSelectionView={
            <FlexBox
              vertical={true}
              style={{ height: '100%', background: Colors.DARK_GREY }}
              justify={'flex-start'}
            >
              {booking === undefined ?
                <FlexBox vertical={true} flexBias={1}>
                  <BaseText
                    text={'No Session selected'}
                    alignment={'center'}
                    styles={{ fontWeight: 'bold' }}
                  />
                </FlexBox>
                :
                <BookingPanelSelectionView
                  session={booking}
                  resetSelectedSession={() => setSelectedSessionId(null)}
                />
              }
            </FlexBox>
          }
        />
      </BookingContext.Provider>
    </FullScreenTile>
  )
}