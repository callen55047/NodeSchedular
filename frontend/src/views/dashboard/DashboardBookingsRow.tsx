import React, { useContext, useEffect } from 'react'
import { NavContext } from '../navigator/NavContext'
import { FlexBox } from '../components/view/FlexLayouts'
import { HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import SessionStructure from '../../internal/dataAccess/SessionStructure'
import sessionStructure from '../../internal/dataAccess/SessionStructure'
import { NAVIGATOR_VIEWS } from '../navigator/INavigatorView'
import Chart from 'chart.js/auto'
import AsyncStateFetch from '../../internal/state/AsyncStateFetch'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { Tile, TileRowContainer } from '../components/TileLayout'
import { DashboardContactCard } from '../components/contact/ContactViewComps'
import { IAuditRecord } from '../../internal/models/AuditRecord'
import _, { Dictionary } from 'lodash'
import { MONTH_NAME_LIST } from '../../internal/dateAndTime/DateConstants'

export default function DashboardBookingsRow() {
  const { api } = useContext(AppInstance)
  const { sessions, requestNewComponent, transactions } = useContext(NavContext)
  const salesTask = AsyncStateFetch(() => api.financialReport.sales())

  // const readyForPayments = SessionStructure.filterReadyForPayment(sessions, transactions)
  const sessionsToday = sessionStructure.filterToday(sessions)

  useEffect(() => {
    if (!salesTask.data) {
      return
    }

    const { cardRecords, cashRecords } = salesTask.data
    const groupedCards = groupRecordsByMonth(cardRecords)
    const groupedCash = groupRecordsByMonth(cashRecords)
    const monthlyCardEarnings = []
    const monthlyCashEarnings = []

    for (const month of MONTH_NAME_LIST) {
      const cards = groupedCards[month]
      if (cards) {
        const monthlyTotal = cards.reduce((acc, item) => acc + (item.charge ?? 0), 0)
        monthlyCardEarnings.push(monthlyTotal / 100)
      } else {
        monthlyCardEarnings.push(0)
      }

      const cash = groupedCash[month]
      if (cash) {
        const monthlyTotalCash = cards.reduce((acc, item) => acc + (item.charge ?? 0), 0)
        monthlyCashEarnings.push(monthlyTotalCash / 100)
      } else {
        monthlyCashEarnings.push(0)
      }
    }

    const data = {
      labels: MONTH_NAME_LIST,
      datasets: [
        {
          label: 'Card Sales',
          data: monthlyCardEarnings,
          backgroundColor: '#87CEEB',
          borderColor: '#87CEEB',
          borderWidth: 1
        },
        {
          label: 'Cash Sales',
          data: monthlyCashEarnings,
          backgroundColor: '#90EE90',
          borderColor: '#90EE90',
          borderWidth: 1
        }
      ]
    }

    const ctx = document.getElementById('salesChart') as HTMLCanvasElement

    const chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y
                }
                return label
              }
            }
          }
        }
      }
    })

    return () => {
      chart.destroy()
    }
  }, [salesTask.data])

  function groupRecordsByMonth(records: IAuditRecord[]): Dictionary<IAuditRecord[]> {
    return _.groupBy(records, record => {
      const date = new Date(record.created_at)
      return date.toLocaleString('default', { month: 'short' })
    })
  }

  function jumpToBookingsPage(session_id: string) {
    requestNewComponent({
      ...NAVIGATOR_VIEWS.BOOKINGS,
      params: { session_id }
    })
  }

// TODO: test jumping to specific session
  return (
    <TileRowContainer>
      <Tile name={'Bookings Today'}>
        <FlexBox vertical style={{ overflow: 'auto' }}>
          {sessionsToday.map((session) => {
            return (
              <>
                <DashboardContactCard
                  session={session}
                  handleOnClick={jumpToBookingsPage}
                />
                <VerticalSpacer size={10} />
              </>
            )
          })}
        </FlexBox>
      </Tile>

      <HorizontalSpacer size={15} />

      <Tile name={'Sales'}>
        <FlexBox style={{ maxHeight: 500 }}>
          <canvas id="salesChart" />
        </FlexBox>
      </Tile>
    </TileRowContainer>
  )
}
