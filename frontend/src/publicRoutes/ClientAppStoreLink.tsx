import React, { useEffect } from 'react'
import { ThemedAppContainer } from '../views/components/view/Containers'
import { FlexBox } from '../views/components/view/FlexLayouts'
import ImageURI from '../views/images/ImageURI'
import { VerticalSpacer } from '../views/components/ViewElements'
import { HorizontalAppStoreLinks } from './shared/MarketingComponents'
import ShareLinks from '../internal/sharing/ShareLinks'
import RegisterAppTraffic from '../internal/browser/RegisterAppTraffic'
import LocalImages from "../views/images/LocalImages";

export default function ClientAppStoreLink() {

  useEffect(() => {
    registerTrafficAndRedirect()
  }, [])

  async function registerTrafficAndRedirect() {
    const userAgent = navigator.userAgent
    await RegisterAppTraffic()

    let newUrl
    if (/android/i.test(userAgent)) {
      newUrl = ShareLinks.appstore.android
    } else {
      newUrl = ShareLinks.appstore.ios
    }

    window.location.replace(newUrl)
  }

  return (
    <ThemedAppContainer>
      <FlexBox vertical={true} justify={'center'}>
        <img
          src={LocalImages.BANNER_LOGO}
          alt={'banner'}
          style={{
            maxWidth: 200,
            objectFit: 'contain',
            alignSelf: 'center'
          }}
        />

        <VerticalSpacer size={10} />

        <HorizontalAppStoreLinks />
      </FlexBox>
    </ThemedAppContainer>
  )
}