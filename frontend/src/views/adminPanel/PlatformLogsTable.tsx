import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '../../theme/Theme'
import { BaseText } from '../../theme/CustomText'
import { HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import { FlexBox } from '../components/view/FlexLayouts'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { TextButton } from '../components/Buttons'
import { getLogColor, IEventLog } from '../../internal/models/EventLog'
import { SearchBox } from '../components/ListViewComponents'
import { SelectionList } from '../components/Selectors'
import { BaseTable } from '../components/Tables'
import FromUtcDate from '../../internal/DateAndTime'

let _platformLogsTask: IEventLog[] | null = null

enum ELogSorting {
  ALL = 'All Platforms',
  PORTAL = 'artist portal',
  CLIENT_APP = 'client app',
  SERVICES = 'services'
}

enum ELogTypeSorting {
  ALL = 'All Types',
  WARNING = 'warning',
  ERROR = 'error',
  EXCEPTION = 'exception'
}

export default function PlatformLogsTable() {
  const { api } = useContext(AppInstance)
  const [logs, setLogs] = useState<IEventLog[]>([])
  const [sorting, setSorting] = useState<string>(ELogSorting.ALL)
  const [typeSorting, setTypeSorting] = useState<string>(ELogTypeSorting.ALL)
  const [search, setSearch] = useState('')

  const sortedLogs = sortAndFilter()

  useEffect(() => {
    fetchArtists()

    return () => {
      _platformLogsTask = null
    }
  }, [])

  async function fetchArtists() {
    _platformLogsTask = await api.admin.platformLogs()
    if (_platformLogsTask) {
      setLogs(_platformLogsTask)
    }
  }

  function isContainedInSearch(eventLog: IEventLog): boolean {
    if (!search) {
      return true
    }

    const normalizedSearch = search.toLowerCase()
    const normalizedMessage = eventLog.message.toLowerCase()
    const normalizedType = eventLog.type.toLowerCase()
    const normalizedUserId = eventLog.user_id ?? ''

    if (normalizedUserId.includes(normalizedSearch)) {
      return true
    }
    if (normalizedMessage.includes(normalizedSearch)) {
      return true
    }
    return normalizedType.includes(normalizedSearch)
  }

  function sortAndFilter(): IEventLog[] {
    return logs
      .filter((l) => {
        if (sorting === ELogSorting.ALL) {
          return true
        }
        return l.platform === sorting
      })
      .filter((l) => {
        if (typeSorting === ELogTypeSorting.ALL) {
          return true
        }
        return l.type === typeSorting
      })
      .sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }

  return (
    <React.Fragment>
      <BaseText text={'Platform Logs'} size={20} styles={{ fontWeight: 'bold' }} />
      <VerticalSpacer size={5} />
      <FlexBox justify={'flex-start'}>
        <BaseText
          text={'View all platform logs.'}
          color={Colors.LIGHT_GREY_00}
        />
        <HorizontalSpacer size={5} />
        <TextButton action={fetchArtists} text={'Refresh'} />
      </FlexBox>
      <VerticalSpacer size={5} />

      <FlexBox
        justify={'flex-start'}
        style={{
          background: Colors.DARK_GREY,
          borderRadius: 4,
          padding: 5
        }}
      >
        <SearchBox currentValue={search} onChange={setSearch} />
        <HorizontalSpacer size={20} />
        <BaseText text={'Filter by'} size={16} alignment={'center'} />
        <HorizontalSpacer size={5} />
        <SelectionList
          options={Object.values(ELogSorting)}
          current={sorting}
          onSelect={setSorting}
        />
        <HorizontalSpacer size={5} />
        <SelectionList
          options={Object.values(ELogTypeSorting)}
          current={typeSorting}
          onSelect={setTypeSorting}
        />
      </FlexBox>
      <VerticalSpacer size={20} />

      <BaseTable
        head={
          <tr>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Platform</th>
            <th>User ID</th>
            <th colSpan={2}>Message</th>
          </tr>
        }
        body={
          <>
            {sortedLogs.map((log) => {
              if (!isContainedInSearch(log)) {
                return null
              }

              const timeStamp = FromUtcDate(log.created_at).fullDateString()

              return (
                <tr
                  key={log._id}
                >
                  <td>{timeStamp}</td>
                  <td style={{ color: getLogColor(log.type) }}>{log.type}</td>
                  <td>{log.platform}</td>
                  <td>{`${log.user_id ?? ' - '}`}</td>
                  <td colSpan={2}>{log.message}</td>
                </tr>
              )
            })}
          </>
        }
      />
    </React.Fragment>
  )
}