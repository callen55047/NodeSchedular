import React from 'react'
import { ModalBase, TModalStateProps } from '../../views/components/Modal'
import { FlexBox } from '../../views/components/view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { VerticalSpacer } from '../../views/components/ViewElements'
import { AppStoreLink } from './MarketingComponents'
import ShareLinks from '../../internal/sharing/ShareLinks'
import ImageURI from '../../views/images/ImageURI'
import LocalImages from "../../views/images/LocalImages";

export default function StoreLinkModal(props: TModalStateProps) {
  return (
    <ModalBase
      isActive={props.isActive}
      setIsActive={props.setIsActive}
      shouldCloseOnEsc={true}
    >
      <FlexBox
        vertical={true}
        margin={30}
        style={{
          textAlign: 'center'
        }}
      >
        <img
          src={LocalImages.BANNER_LOGO}
          alt={'banner'}
          style={{
            maxWidth: 180,
            objectFit: 'contain',
            alignSelf: 'center'
          }}
        />
        <VerticalSpacer size={10} />
        <BaseText text={'Download now!'} styles={{ fontWeight: 'bold' }} />
        <VerticalSpacer size={40} />

        <AppStoreLink
          link={ShareLinks.appstore.android}
          url={ImageURI.GOOGLE_PLAY_MARKETING}
        />
        <VerticalSpacer size={20} />
        <AppStoreLink
          link={ShareLinks.appstore.ios}
          url={ImageURI.APP_STORE_MARKETING}
        />
      </FlexBox>
    </ModalBase>
  )
}