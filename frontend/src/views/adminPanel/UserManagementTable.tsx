import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '../../theme/Theme'
import { BaseText } from '../../theme/CustomText'
import { HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import { FlexBox } from '../components/view/FlexLayouts'
import { EAccountRole, IAccount } from '../../internal/models/Account'
import { ApiContract } from '../../contracts/ApiContract'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { TextButton } from '../components/Buttons'
import { BaseTable } from '../components/Tables'
import { SearchBox } from '../components/ListViewComponents'
import { SelectionList } from '../components/Selectors'
import { EUserSorting, isContainedInSearch, sortList } from './AccountManageShared'
import { ProfileAvatar } from '../images/ImageDisplayViews'
import FromUtcDate from '../../internal/DateAndTime'
import AccountStructure from '../../internal/dataAccess/AccountStructure'

let _userTask: ApiContract.Response.accounts | null = null

export default function UserManagementTable() {
  const { api } = useContext(AppInstance)
  const [artists, setArtists] = useState<IAccount[]>([])
  const [sorting, setSorting] = useState<string>(EUserSorting.JOINED)
  const [search, setSearch] = useState('')

  const sortedArtists = sortList(artists, sorting)
  const activeAccounts = artists.filter((a) => !a.deleted_at)
  const monthlyAccounts = AccountStructure.monthlyAccounts(activeAccounts)

  useEffect(() => {
    fetchUsers()

    return () => {
      _userTask = null
    }
  }, [])

  async function fetchUsers() {
    _userTask = await api.admin.getAccounts(EAccountRole.USER)
    if (_userTask?.accounts) {
      setArtists(_userTask.accounts)
    }
  }

  return (
    <React.Fragment>
      <BaseText text={'User List'} size={20} styles={{ fontWeight: 'bold' }} />
      <VerticalSpacer size={5} />
      <FlexBox justify={'flex-start'}>
        <BaseText
          text={'View all current client user accounts.'}
          color={Colors.LIGHT_GREY_00}
        />
        <HorizontalSpacer size={5} />
        <TextButton action={fetchUsers} text={'Refresh'} />
      </FlexBox>
      <VerticalSpacer size={5} />
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
        <BaseText text={`Monthly: ${monthlyAccounts.length}`} alignment={'center'} />
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
            {sortedArtists.map((user) => {
              if (!isContainedInSearch(user, search)) {
                return null
              }

              const dateJoinedString = FromUtcDate(user.created_at).fullDateString()
              const lastOnlineDay = FromUtcDate(user.last_ping_at).fullDateString()
              const deletionDay = user.deleted_at ? FromUtcDate(user.deleted_at).fullDateString() : ''

              return (
                <tr
                  key={user._id}
                >
                  <td>
                    <ProfileAvatar size={40} src={user.profile_pic?.url} />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td>{dateJoinedString}</td>
                  <td>{lastOnlineDay}</td>
                  <td>{deletionDay}</td>
                </tr>
              )
            })}
          </>
        }
      />
    </React.Fragment>
  )
}