import React, { useContext } from 'react'
import { Tile, TileRowContainer } from './components/TileLayout'
import { AppVersionBottomRight, HorizontalSpacer } from './components/ViewElements'
import { Text48 } from '../theme/CustomText'
import { NavContext } from './navigator/NavContext'
import DashboardBookingsRow from './dashboard/DashboardBookingsRow'
import { AppInstance } from '../appEntry/appContainer/AppContext'
import ThreadStructure from '../internal/dataAccess/ThreadStructure'
import InquiryStructure from '../internal/dataAccess/InquiryStructure'
import { StarList } from './components/UserViewComps'

export default function Dashboard() {
  const { currentUser } = useContext(AppInstance)
  const { inquiries, messages } = useContext(NavContext)

  const newContactMessages = ThreadStructure.allUnreadMessages({
    messages,
    user: currentUser!
  })

  const newInquiries = InquiryStructure.buildActiveInquiries(inquiries)

  return (
    <React.Fragment>
      <TileRowContainer>
        <Tile name={'Inquiries'}>
          <NumberDisplay text={`${newInquiries.length}`} />
        </Tile>
        <HorizontalSpacer size={15} />
        <Tile name={'Messages'}>
          <NumberDisplay text={`${newContactMessages}`} />
        </Tile>
        <HorizontalSpacer size={15} />
        <Tile name={'Rating'}>
          <StarList ratings={currentUser!.ratings} />
        </Tile>
      </TileRowContainer>

      <DashboardBookingsRow />

      <AppVersionBottomRight />
    </React.Fragment>
  )
}

const NumberDisplay = (props: { text: string }) => {
  return <Text48 text={props.text} />
}