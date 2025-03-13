import ImageURI from '../../views/images/ImageURI'
import { FlexBox } from '../../views/components/view/FlexLayouts'
import React from 'react'
import WindowLocation from '../../internal/browser/WindowLocation'
import { HorizontalSpacer } from '../../views/components/ViewElements'
import ShareLinks from '../../internal/sharing/ShareLinks'

const AppStoreLink = (props: { url: string, link: string }) => {
  return (
    <img
      src={props.url}
      alt={'app-store-link-image'}
      style={{
        maxWidth: 150,
        objectFit: 'contain',
        alignSelf: 'center'
      }}
      onClick={() => WindowLocation.newTab(props.link)}
    />
  )
}

const HorizontalAppStoreLinks = () => {
  return (
    <FlexBox justify={'center'}>
      <AppStoreLink
        link={ShareLinks.appstore.android}
        url={ImageURI.GOOGLE_PLAY_MARKETING}
      />
      <HorizontalSpacer size={20} />
      <AppStoreLink
        link={ShareLinks.appstore.ios}
        url={ImageURI.APP_STORE_MARKETING}
      />
    </FlexBox>
  )
}

export {
  AppStoreLink,
  HorizontalAppStoreLinks
}