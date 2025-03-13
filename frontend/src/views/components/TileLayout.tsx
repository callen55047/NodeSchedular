import React, { ReactNode } from 'react'
import { BorderRadius, Colors } from '../../theme/Theme'
import { FlexBox } from './view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { DynamicSpacer, VerticalSpacer } from './ViewElements'
import { MultiLabelSwitch, TMultiLabelSwitch } from './Switches'
import { RChildren } from '../../types/GenericTypes'

type NameAndChildren = {
  name?: string,
  children?: ReactNode
}

const TileRowContainer = ({ children }: { children: ReactNode }) => {
  return <div
    className="tile-row"
    style={{
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: 15
    }}>
    {children}
  </div>
}

interface ITileProps extends NameAndChildren {
  maxHeight?: number
}
const Tile = ({ name, children, maxHeight }: ITileProps) => {
  return <div
    className={'tile-item'}
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: 25,
      maxWidth: 'calc(100% - 30px)',
      background: Colors.DARK_00,
      flex: 1,
      borderRadius: 10,
      minHeight: 100,
      maxHeight
    }}
  >
    <TileHeading3 name={name} />
    {children}
  </div>
}

const FullScreenTile = ({ name, children }: NameAndChildren) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      height: 'calc(100% - 15px)',
      flex: 1
    }}>
      <Tile name={name}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          overflow: 'hidden'
        }}>
          {children}
        </div>
      </Tile>
    </div>
  )
}

interface ITileMultiSelectionProps extends TMultiLabelSwitch, RChildren {
  title: string
}
const TileMultiSelection = (props: ITileMultiSelectionProps) => {
  const { title, options, current, onSelect, children } = props
  return (
    <div
      style={{
        background: Colors.DARK_00,
        borderRadius: BorderRadius.r10,
        padding: 15
      }}
    >
      <FlexBox vertical>
        <FlexBox>
          <TileHeading3 name={title} />
          <DynamicSpacer size={1} />
          <MultiLabelSwitch
            current={current}
            onSelect={onSelect}
            options={options}
          />
        </FlexBox>
        <VerticalSpacer size={15} />
        <FlexBox flexBias={1}>
          {children}
        </FlexBox>
      </FlexBox>
    </div>
  )
}

const TileHeading3 = ({ name }: { name: string | undefined }) => {
  return name ? <h3 className="theme-title" style={{ margin: '0 0 20px 0' }}>{name}</h3> : null
}

const TileHeadingAndSub = ({ title, sub }: { title: string, sub: string }) => {
  return <FlexBox vertical={true}>
    <BaseText text={title} size={24} styles={{fontWeight: 'bold'}} />
    <VerticalSpacer size={10} />
    <BaseText text={sub} size={14} color={Colors.LIGHT_GREY_00} />
  </FlexBox>
}

export {
  TileRowContainer,
  TileHeading3,
  Tile,
  FullScreenTile,
  TileHeadingAndSub,
  TileMultiSelection
}