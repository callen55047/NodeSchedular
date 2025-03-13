import React, { useContext, useState } from 'react'
import { FullScreenTile } from './components/TileLayout'
import { ContactListDisplay, InquiryContact } from './components/contact/ContactViewComps'
import { NavContext } from './navigator/NavContext'
import { PlaceholderSign, VerticalSpacer } from './components/ViewElements'
import { isNullOrEmpty } from '../internal/ObjectHelpers'
import { AppInstance } from '../appEntry/appContainer/AppContext'
import InquiryStructure from '../internal/dataAccess/InquiryStructure'
import { SearchBox } from './components/ListViewComponents'
import SelectedInquiryView from './inquiries/SelectedInquiryView'
import { EInquiryStatus, IInquiry } from '../internal/models/Inquiry'
import { AutoSelectFromList } from './components/ViewProperties'
import { toast } from 'react-toastify'
import { SideListSelectionView } from './components/view/ListSelectionLayout'
import { BaseText } from '../theme/CustomText'

export default function Inquiries() {
  const { runBlocking, api } = useContext(AppInstance)
  const { inquiries, inquiryDispatch, contacts } = useContext(NavContext)
  const [searchText, setSearchText] = useState<string>('')
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null)

  // generated properties
  const activeInquiries = InquiryStructure.buildActiveInquiries(inquiries)
  const filteredInquiries = buildFilteredInquiries(activeInquiries)
  const inquiry = filteredInquiries.find((i) => i._id === selectedInquiryId)
  const inquiriesGroupedByTimeline = InquiryStructure.groupByTimeline(filteredInquiries)

  AutoSelectFromList(
    filteredInquiries,
    selectedInquiryId,
    (i) => {
      setSelectedInquiryId(i._id)
    }
  )

  function buildFilteredInquiries(activeInquiries: IInquiry[]): IInquiry[] {
    return activeInquiries.filter((inquiry) => {
      const user = InquiryStructure.owningContact({ inquiry, contacts })
      if (searchText !== '') {
        const searchName = `${user.first_name} ${user.last_name}`.toLowerCase()
        if (!searchName.includes(searchText.toLowerCase())) {
          return false
        }
      }
      return true
    })
  }

  function handleInquiryDecision(decision: EInquiryStatus) {
    runBlocking(
      async () => {
        const updatedInquiry = await api.inquiry.decision(
          {
            inquiry_id: selectedInquiryId!,
            decision
          })
        if (updatedInquiry) {
          inquiryDispatch({
            type: 'UPDATE_LIST',
            list: [updatedInquiry]
          })
          setSelectedInquiryId(null)
          if (updatedInquiry.status === EInquiryStatus.ACCEPTED) {
            toast.success('Accepted! You can now chat with this user in the messages page.')
          }

        }
      }
    )
  }


  if (isNullOrEmpty(activeInquiries)) {
    return (
      <FullScreenTile name={'Inquiries'}>
        <PlaceholderSign text={'You\'re all caught up!'} icon={'fa-check'} />
      </FullScreenTile>
    )
  }

  return (
    <FullScreenTile>
      <SideListSelectionView
        title={'Select Inquiry'}
        ItemListView={
          <React.Fragment>
            <SearchBox
              currentValue={searchText}
              onChange={(text) => setSearchText(text)}
            />
            <VerticalSpacer size={8} />
            <ContactListDisplay>
              {Object.entries(inquiriesGroupedByTimeline).map(([timeline, tInquiries]) => {
                return <>
                  <BaseText
                    text={timeline}
                    styles={{ margin: 5, fontWeight: 'bold' }}
                  />
                  {tInquiries.map((inquiry) => {
                    const user = InquiryStructure.owningContact({ inquiry, contacts })
                    return <InquiryContact
                      user={user}
                      inquiry={inquiry}
                      isSelected={inquiry._id === selectedInquiryId}
                      onClick={() => setSelectedInquiryId(inquiry._id)}
                    />
                  })}
                </>
              })}
            </ContactListDisplay>
          </React.Fragment>
        }
        ItemSelectionView={
          <SelectedInquiryView
            selectedInquiry={inquiry}
            handleInquiryDecision={handleInquiryDecision}
          />
        }
      />
    </FullScreenTile>
  )
}
