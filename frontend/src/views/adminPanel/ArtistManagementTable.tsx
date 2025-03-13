import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '../../theme/Theme'
import { BaseText } from '../../theme/CustomText'
import { HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import { FlexBox } from '../components/view/FlexLayouts'
import { EAccountRole, IAccount } from '../../internal/models/Account'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import CreateNewArtistModal from './artistManagement/CreateNewArtistModal'
import { TextButton } from '../components/Buttons'
import ArtistDetailsModal from './artistManagement/ArtistDetailsModal'
import { BaseTable } from '../components/Tables'
import { SearchBox } from '../components/ListViewComponents'
import { SelectionList } from '../components/Selectors'
import { EUserSorting, isContainedInSearch, sortList } from './AccountManageShared'
import { ProfileAvatar } from '../images/ImageDisplayViews'
import FromUtcDate from '../../internal/DateAndTime'
import { AdminPageHeading } from './AdminPanelViewComps'
import AsyncStateFetch from '../../internal/state/AsyncStateFetch'
import AccountStructure from '../../internal/dataAccess/AccountStructure'

export default function ArtistManagementTable() {
  const { api } = useContext(AppInstance)
  const artistTask = AsyncStateFetch(() => api.admin.getAccounts(EAccountRole.ARTIST))
  const [selectedArtist, setSelectedArtist] = useState<IAccount | null>(null)
  const [sorting, setSorting] = useState<string>(EUserSorting.JOINED)
  const [search, setSearch] = useState('')

  const artists = artistTask.data?.accounts ?? []
  const sortedArtists = sortList(artists, sorting)
  const activeAccounts = artists.filter((a) => !a.deleted_at && a.stripe_id != null)
  const monthlyArtists = AccountStructure.monthlyAccounts(activeAccounts)

  function onListModified() {
    artistTask.reload()
  }

  return (
    <React.Fragment>
      <AdminPageHeading text={'Artist Management'} />
      <VerticalSpacer size={5} />
      <FlexBox justify={'flex-start'}>
        <BaseText
          text={'View all current artists and create invitations for new ones.'}
          color={Colors.LIGHT_GREY_00}
        />
        <HorizontalSpacer size={5} />
        <TextButton action={() => artistTask.reload()} text={'Refresh'} />
      </FlexBox>
      <VerticalSpacer size={5} />

      {/*TODO: extract this into component*/}
      <FlexBox
        justify={'space-between'}
        style={{
          background: Colors.DARK_GREY,
          borderRadius: 4,
          padding: 5
        }}
      >
        <FlexBox>
          <SearchBox currentValue={search} onChange={setSearch} />
          <HorizontalSpacer size={20} />
          <BaseText text={'Sort by'} size={16} alignment={'center'} />
          <HorizontalSpacer size={5} />
          <SelectionList
            options={Object.values(EUserSorting)}
            current={sorting}
            onSelect={setSorting}
          />
        </FlexBox>

        <BaseText text={`Active: ${activeAccounts.length}`} alignment={'center'} />
        <BaseText text={`Monthly: ${monthlyArtists.length}`} alignment={'center'} />

        <CreateNewArtistModal onNewArtist={onListModified} />
      </FlexBox>
      <VerticalSpacer size={20} />

      <BaseTable
        head={
          <tr>
            <th></th>
            <th>Username</th>
            <th>Email</th>
            <th>Name</th>
            <th>Joined</th>
            <th>Last login</th>
            <th>Deleted on</th>
          </tr>
        }
        body={
          <>
            {sortedArtists.map((artist) => {
              if (!isContainedInSearch(artist, search)) {
                return null
              }

              const dateJoinedString = FromUtcDate(artist.created_at).fullDateString()
              const lastOnlineDay = FromUtcDate(artist.last_ping_at).fullDateString()
              const deletionDay = artist.deleted_at ? FromUtcDate(artist.deleted_at).fullDateString() : ''

              return (
                <tr
                  key={artist._id}
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedArtist(artist)}
                >
                  <td>
                    <ProfileAvatar size={40} src={artist.profile_pic?.url} />
                  </td>
                  <td>{artist.username}</td>
                  <td>{artist.email}</td>
                  <td>{`${artist.first_name} ${artist.last_name}`}</td>
                  <td>{dateJoinedString}</td>
                  <td>{lastOnlineDay}</td>
                  <td>{deletionDay}</td>
                </tr>
              )
            })}
          </>
        }
      />

      <ArtistDetailsModal
        artist={selectedArtist}
        setArtist={setSelectedArtist}
        updateArtist={onListModified}
      />
    </React.Fragment>
  )
}