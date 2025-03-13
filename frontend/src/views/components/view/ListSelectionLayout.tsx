import React, { ReactNode, useContext } from 'react'
import { FlexBox } from './FlexLayouts'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { SimpleButton } from '../Buttons'
import Popover from '../Popover'

interface ISideListSelectionProps {
  title: string,
  ItemListView: ReactNode,
  ItemSelectionView: ReactNode
}

function SideListSelectionView(props: ISideListSelectionProps) {
  const { displayManager } = useContext(AppInstance)
  const { title, ItemListView, ItemSelectionView } = props

  return (
    <FlexBox flexBias={1} style={{
      height: '100%'
    }}>
      <FlexBox vertical={true} flexBias={1}>
        {displayManager.isTabletView &&
          <FlexBox justify={'flex-start'} style={{
            marginBottom: 10
          }}>
            <Popover
              content={ItemListView}
              minWidth={250}
            >
              <SimpleButton
                theme={'PRIMARY'}
                text={title}
                action={() => {
                }}
                slim={true}
                icon={'fa-align-justify'}
              />
            </Popover>
          </FlexBox>
        }
        <FlexBox
          style={{
            overflow: 'auto'
          }}
          flexBias={1}
        >
          {!displayManager.isTabletView &&
            <FlexBox
              vertical={true}
              flexBias={1}
              justify={'flex-start'}
              style={{
                marginRight: 15,
                minWidth: 250
              }}
            >
              {ItemListView}
            </FlexBox>
          }
          <FlexBox
            vertical={true}
            flexBias={4}
            style={{
              borderRadius: 10,
              overflow: 'auto'
            }}
          >
            {ItemSelectionView}
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export {
  SideListSelectionView
}