import React, { useState } from 'react'
import { useContext } from 'react'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import AsyncStateFetch from '../../internal/state/AsyncStateFetch'
import { AdminPageHeading } from './AdminPanelViewComps'
import { HorizontalSpacer, Icon, VerticalSpacer } from '../components/ViewElements'
import { FlexBox } from '../components/view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { Colors } from '../../theme/Theme'
import { TextButton } from '../components/Buttons'
import { BaseTable } from '../components/Tables'
import FromUtcDate from '../../internal/DateAndTime'
import { SearchBox } from '../components/ListViewComponents'
import { IAppTraffic } from '../../internal/models/AppTraffic'

export default function AppTrafficTable() {
  const { api } = useContext(AppInstance)
  const trafficTask = AsyncStateFetch(() => api.appTraffic.all())
  const [search, setSearch] = useState('')

  const traffic = filterTraffic()

  function filterTraffic(): IAppTraffic[] {
    return trafficTask.data?.filter((t) => {
      const normalizedSearch = search.toLowerCase()

      if (t.group_name != null) {
        if (t.group_name?.toLowerCase().includes(normalizedSearch)) {
          return true
        }
      }

      if (t.account_id != null) {
        return t.account_id.username.includes(normalizedSearch)
      }

      return t.device_info.includes(normalizedSearch)
    }) ?? []
  }

  return (
    <>
      <AdminPageHeading text={'App Traffic Data'} />
      <VerticalSpacer size={5} />
      <FlexBox justify={'flex-start'}>
        <BaseText
          text={'View traffic from social media and other marketing avenues.'}
          color={Colors.LIGHT_GREY_00}
        />
        <HorizontalSpacer size={5} />
        <TextButton action={trafficTask.reload} text={'Refresh'} />
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
        <SearchBox currentValue={search} onChange={setSearch} />

        <BaseText text={`Entries: ${traffic.length}`} alignment={'center'} />
        <HorizontalSpacer size={15} />
      </FlexBox>
      <VerticalSpacer size={20} />

      <BaseTable
        head={
          <tr>
            <th></th>
            <th>Source</th>
            <th>Target</th>
            <th>Group</th>
            <th>Device Info</th>
            <th>Date</th>
          </tr>
        }
        body={
          <>
            {traffic.map((traffic) => {
              const dateString = FromUtcDate(traffic.created_at).fullDateString()
              const targetString = traffic.account_id ? traffic.account_id.username : 'App Store'
              const sourceIcon = traffic.source === 'instagram' ? 'fa-instagram' : 'fa-internet-explorer'

              return (
                <tr key={traffic._id}>
                  <td>
                    <Icon name={sourceIcon} rSize={1.6} margin={0} />
                  </td>
                  <td>
                    <BaseText
                      text={traffic.source}
                      styles={{fontWeight: 'bold'}}
                    />
                  </td>
                  <td>{targetString}</td>
                  <td>{traffic.group_name}</td>
                  <td>{traffic.device_info}</td>
                  <td>{dateString}</td>
                </tr>
              )
            })}
          </>
        }
      />
    </>
  )
}