import React, { useContext } from 'react'
import { BaseText } from '../../theme/CustomText'
import { HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import { FlexBox } from '../components/view/FlexLayouts'
import { Colors } from '../../theme/Theme'
import { TextButton } from '../components/Buttons'
import { BaseTable } from '../components/Tables'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import AsyncStateFetch from '../../internal/state/AsyncStateFetch'
import { sortByCreatedAt } from '../../internal/ArrayUtils'
import FromUtcDate from '../../internal/DateAndTime'
import { AccountData, DetailsData, TitleCell } from './pendingRequests/PendingRequestsComps'

export default function PendingRequestsTable() {
  const { api } = useContext(AppInstance)
  const task = AsyncStateFetch(() => api.admin.pendingRequests())

  const data = task.data ? [...task.data.pendingInquiries, ...task.data.pendingSessions] : []
  const sortedData = sortByCreatedAt(data, 'desc')

  return (
    <>
      <BaseText text={'Pending Requests'} size={20} styles={{ fontWeight: 'bold' }} />
      <VerticalSpacer size={5} />
      <FlexBox justify={'flex-start'}>
        <BaseText
          text={'View all inquiry and session requests that have not been responded to.'}
          color={Colors.LIGHT_GREY_00}
        />
        <HorizontalSpacer size={5} />
        <TextButton action={task.reload} text={'Refresh'} />
      </FlexBox>
      <VerticalSpacer size={20} />

      <BaseTable
        head={
          <tr>
            <th>Type</th>
            <th>Artist</th>
            <th>User</th>
            <th>Details</th>
            <th>Created</th>
          </tr>
        }
        body={
          <>
            {sortedData.map((i) => {
              const common = i as any
              const daysAgo = FromUtcDate(common.created_at).daysPastString()
              const artist = task.data?.accounts.find(a => a._id === common.artist_id)!
              const user = task.data?.accounts.find(a => a._id === common.user_id)!

              return (
                <tr key={`key-${common._id}`}>
                  <td><TitleCell item={i} /></td>
                  <td><AccountData account={artist} /></td>
                  <td><AccountData account={user} /></td>
                  <td><DetailsData item={i} /></td>
                  <td>{daysAgo}</td>
                </tr>
              )
            })}
          </>
        }
      />
    </>
  )
}
