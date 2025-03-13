import { EAuditRecordType, IAuditRecord } from '../../internal/models/AuditRecord'
import { FlexBox } from './view/FlexLayouts'
import { HorizontalSpacer, Icon, VerticalSpacer } from './ViewElements'
import { BaseText } from '../../theme/CustomText'
import { Colors } from '../../theme/Theme'
import React from 'react'
import FromUtcDate from '../../internal/DateAndTime'

const AuditRecordListItem = ({ record }: { record: IAuditRecord }) => {
  const dateString = FromUtcDate(record.created_at).fullDateString()
  const amount = record.charge ? (record.charge / 100) : 0
  const { icon, amountPrefix } = getIconAndAmountPrefix(record)

  return (
    <FlexBox margin={5} justify={'space-between'}>
      <FlexBox>
        <Icon
          name={icon}
          color={'white'}
          rSize={1.6}
          margin={0}
        />
        <HorizontalSpacer size={15} />
        <FlexBox vertical={true}>
          <BaseText text={`Type: ${record.type}`} styles={{ fontWeight: 'bold' }} />
          <VerticalSpacer size={5} />
          <BaseText text={dateString} color={Colors.LIGHT_GREY_00} />
          <VerticalSpacer size={5} />
          <BaseText text={record.message} color={Colors.LIGHT_GREY_00} />
        </FlexBox>
      </FlexBox>
      <FlexBox vertical={true}>
        <BaseText
          text={`${amountPrefix}CA$${amount}`}
          styles={{ fontWeight: 'bold' }}
          size={18}
        />
      </FlexBox>
    </FlexBox>
  )
}

const getIconAndAmountPrefix = (record: IAuditRecord): { icon: string, amountPrefix: string } => {
  let icon: string
  let amountPrefix = ''

  switch (record.type) {
    case EAuditRecordType.INTENT:
      icon = 'fa-cart-plus'
      break
    case EAuditRecordType.CONFIRM:
      icon = 'fa-credit-card'
      break
    case EAuditRecordType.CASH:
      icon = 'fa-money'
      break
    case EAuditRecordType.REFUND || EAuditRecordType.REMOVE_CASH:
      icon = 'fa-balance-scale'
      amountPrefix = '-'
      break
    default:
      icon = 'fa-exclamation-triangle'
  }

  return { icon, amountPrefix }
}

export {
  AuditRecordListItem,
  getIconAndAmountPrefix
}