import React, { ReactNode } from 'react'
import { FlexBox } from './view/FlexLayouts'

interface IBaseTableProps {
  head: ReactNode,
  body: ReactNode
}
function BaseTable(props: IBaseTableProps) {
  const { head, body } = props

  return (
    <FlexBox
      vertical={true}
      justify={'flex-start'}
      flexBias={1}
      style={{
        overflowY: 'auto',
        position: 'relative',
        maxHeight: '100%'
      }}
    >
      <table className={'base-table'}>
        <thead
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
        >
        {head}
        </thead>
        <tbody>
        {body}
        </tbody>
      </table>
    </FlexBox>
  )
}

export {
  BaseTable
}