import React from 'react'
import LocalImages from '../../views/images/LocalImages'
import { BaseText } from '../../theme/CustomText'
import { FlexBox } from '../../views/components/view/FlexLayouts'
import { Colors } from '../../theme/Theme'

const PortalBannerLogo = () => {
  return (
    <FlexBox>
      <img
        src={LocalImages.BANNER_LOGO}
        alt={'portal-banner-logo'}
        style={{
          objectFit: 'contain',
          width: 250,
          margin: 25
        }}
      />
    </FlexBox>
  )
}

const PublicTitle = ({ text }: { text: string }) => {
  return (
    <BaseText text={text} size={34} alignment={'center'} styles={{ fontWeight: 'bold' }} />
  )
}

const PublicSubtitle = ({ text }: { text: string }) => {
  return (
    <BaseText text={text} color={Colors.LIGHT_GREY_00} />
  )
}

export {
  PortalBannerLogo,
  PublicTitle,
  PublicSubtitle
}