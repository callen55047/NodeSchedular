import React, { useContext } from 'react'
import { Tile, TileHeadingAndSub, TileRowContainer } from '../components/TileLayout'
import { VerticalSpacer } from '../components/ViewElements'
import { SectionHeading } from './SettingsViewComps'
import { MultiLabelSwitch } from '../components/Switches'
import { EStartPage } from '../../internal/models/settings/ArtistSettings'
import { FlexBox } from '../components/view/FlexLayouts'
import { SettingsContext } from './SettingsContext'

export default function GeneralSettings() {
  const { artistSettings, setArtistSettings } = useContext(SettingsContext)

  function updateStartPage(value: string) {
    setArtistSettings({...artistSettings, portal_start_page: value as EStartPage })
  }

  return (
    <TileRowContainer>
      <Tile>
        <TileHeadingAndSub
          title={'General'}
          sub={'Modify settings related to the portal user experience'}
        />
        <VerticalSpacer size={30} />
        <SectionHeading name={'Home page'} />
        <FlexBox justify={'flex-start'}>
          <MultiLabelSwitch
            options={Object.values(EStartPage)}
            current={artistSettings.portal_start_page}
            onSelect={updateStartPage}
          />
        </FlexBox>
      </Tile>
    </TileRowContainer>
  )
}