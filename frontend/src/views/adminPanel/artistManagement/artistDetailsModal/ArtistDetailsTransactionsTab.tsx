import React, { useContext } from 'react'
import { ArtistDetailContext } from './ArtistDetailContext'
import { FlexBox } from '../../../components/view/FlexLayouts'
import { HorizontalSpacer, Icon, VerticalSpacer } from '../../../components/ViewElements'
import { SimpleLabelAndValue } from '../../../components/Inputs'
import FromUtcDate from '../../../../internal/DateAndTime'
import { getIconAndAmountPrefix } from '../../../components/AuditRecordViewComps'
import _ from 'lodash'
import { EAuditRecordType } from '../../../../internal/models/AuditRecord'
import ProgressBar from '../../../components/progress/ProgressBar'
import { BaseTable } from '../../../components/Tables'

export default function ArtistDetailsTransactionsTab() {
  const { details } = useContext(ArtistDetailContext)

  let totalCharged = 0
  const groupedRecords = _.groupBy(details.auditRecords, (r) => r.session_id)
  const completedRecords = Object.entries(groupedRecords).filter(([key, value]) => {
    const invalidCases = value.filter((v) => {
      return [
        EAuditRecordType.CASH,
        EAuditRecordType.REFUND,
        EAuditRecordType.REMOVE_CASH,
      ].includes(v.type)
    })

    if (invalidCases.length === 0) {
      totalCharged += value
        .filter((v) => v.type === EAuditRecordType.CONFIRM)
        .reduce((acc, item) => acc + (item.charge ?? 0), 0)
      return true
    }

    return false
  })

  const chargeDisplay = totalCharged > 0 ? (totalCharged / 100) : 0

  return (
    <FlexBox
      vertical={true}
      justify={'flex-start'}
      style={{
        height: 500,
        overflow: 'auto'
      }}
    >
      <FlexBox vertical={true}>
        <FlexBox flexBias={1}>
          <SimpleLabelAndValue
            label={'Transactions'}
            value={`${completedRecords.length}`}
          />
          <HorizontalSpacer size={10} />
          <ProgressBar fillPercent={completedRecords.length / 50} />
        </FlexBox>

        <VerticalSpacer size={5} />

        <FlexBox flexBias={1}>
          <SimpleLabelAndValue
            label={'Total'}
            value={`$${chargeDisplay}`}
          />
          <HorizontalSpacer size={10} />
          <ProgressBar fillPercent={chargeDisplay / 50000} />
        </FlexBox>

      </FlexBox>
      <VerticalSpacer size={20} />

      <BaseTable
        head={
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Charge</th>
            <th>App fee</th>
          </tr>
        }
        body={
          <>
            {details.auditRecords.map((record) => {
              if (record.type === EAuditRecordType.INTENT) {
                return null
              }

              const { icon, amountPrefix } = getIconAndAmountPrefix(record)
              const amount = record.charge ? (record.charge / 100) : 0
              const appFeeAmount = record.app_fee ? (record.app_fee / 100) : 0
              const displayDate = FromUtcDate(record.created_at).fullDateString()

              return (
                <tr key={record._id}>
                  <td>{displayDate}</td>
                  <td><Icon name={icon} margin={'0 5px'} />{record.type}</td>
                  <td>{`${amountPrefix}CA$${amount}`}</td>
                  <td>{`${amountPrefix}CA$${appFeeAmount}`}</td>
                </tr>
              )
            })}
          </>
        }
      />
    </FlexBox>
  )
}