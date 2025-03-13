import React, { useContext } from 'react'
import { Tile, TileRowContainer } from '../components/TileLayout'
import { EMetaType } from '../../internal/models/File'
import ManagedImageList from '../components/images/ManagedImageList'
import { NavContext } from '../navigator/NavContext'

export default function ProfileFeaturedImages() {
  const { fileManager } = useContext(NavContext)

  return (
    <TileRowContainer>
      <Tile name={'Featured Images'}>
        <ManagedImageList
          imageType={EMetaType.STOREFRONT}
          fileManager={fileManager}
        />
      </Tile>
    </TileRowContainer>
  )
}