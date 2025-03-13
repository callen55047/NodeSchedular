import React, { useState } from 'react'
import { FullScreenTile } from './components/TileLayout'
import { FlexBox } from './components/view/FlexLayouts'
import { DynamicSpacer } from './components/ViewElements'
import { MultiLabelSwitch } from './components/Switches'
import CancelHistory from './history/CancelHistory'
import RejectedHistory from './history/RejectedHistory'
import DisputeHistory from './history/DisputeHistory'
import CompletedHistory from './history/CompletedHistory'

enum EHistoryTabs {
  COMPLETED = 'Completed',
  REJECTIONS = 'Rejections',
  CANCELLATIONS = 'Cancellations',
  DISPUTES = 'Disputes'
}

export default function History() {
  const [activeFilter, setActiveFilter] = useState<string>(EHistoryTabs.COMPLETED)

  return (
    <FullScreenTile>
      <FlexBox>
        <MultiLabelSwitch
          current={activeFilter}
          onSelect={setActiveFilter}
          options={Object.values(EHistoryTabs)}
        />
        <DynamicSpacer size={1} />
      </FlexBox>

      <ViewSwitch name={activeFilter} />
    </FullScreenTile>
  )
}

const ViewSwitch = ({ name }: { name: string }) => {
  switch (name) {
    case EHistoryTabs.COMPLETED:
      return <CompletedHistory />
    case EHistoryTabs.REJECTIONS:
      return <RejectedHistory />
    case EHistoryTabs.CANCELLATIONS:
      return <CancelHistory />
    default:
      return <DisputeHistory />
  }
}