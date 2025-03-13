import React, { useEffect, useState } from 'react'
import { FlexBox } from '../views/components/view/FlexLayouts'
import { BaseText, Text24, TextLink } from '../theme/CustomText'
import { Colors } from '../theme/Theme'
import { ThemedAppContainer } from '../views/components/view/Containers'
import { Icon, VerticalSpacer } from '../views/components/ViewElements'
import ApiController from '../controllers/ApiController'
import { ApiContract } from '../contracts/ApiContract'
import { ProfileAvatar } from '../views/images/ImageDisplayViews'
import { HorizontalAppStoreLinks } from './shared/MarketingComponents'
import ImageURI from '../views/images/ImageURI'
import BrowserTypes from '../internal/browser/BrowserTypes'
import StoreLinkModal from './shared/StoreLinkModal'
import RegisterAppTraffic from '../internal/browser/RegisterAppTraffic'
import UrlParams from '../internal/browser/UrlParams'
import LocalImages from "../views/images/LocalImages";

/*
  * this class is an example of a public route OUTSIDE the portal context
  * VALID - <ExistingElement />, or new ExistingClass()
  * NOT_VALID - useContext(AppInstance | NavContext)
 */
export default function ArtistPublicProfile() {
  const [artistProfile, setArtistProfile] = useState<ApiContract.Response.PublicArtistProfile | null>(null)
  const [error, setError] = useState("")
  const username = UrlParams().artistUsername

  useEffect(() => {
    tryEmbeddedRedirect()
    tryLoadArtist()
  }, [])

  function tryEmbeddedRedirect() {
    const isEmbedded = navigator.userAgent.includes(BrowserTypes.Embedded.instagram)
    if (isEmbedded) {
      const newUrl = window.location.href.replace("https://", "appDomain://")
      window.location.replace(newUrl)
    }
  }

  async function tryLoadArtist() {
    const res = await new ApiController(null).auth.publicArtistProfile(username ?? "")
    if (res) {
      setArtistProfile(res)
      await RegisterAppTraffic(res.artist)
    } else {
      setError(`No artist found for username: ${username}`)
    }
  }

  return (
    <ThemedAppContainer>
      <FlexBox
        vertical={true}
        justify={'space-between'}
        flexBias={1}
        style={{
          textAlign: 'center',
          marginTop: 20
        }}
      >
        {artistProfile != null ?
          <ArtistProfile profile={artistProfile} />
          :
          error != '' ?
            <Text24 text={`No artist found for username: ${username}`} />
            :
            <Icon name={'fa-gear fa-spin'} margin={0} />
        }

        <FlexBox vertical={true}>
          <img
            src={LocalImages.BANNER_LOGO}
            alt={'banner'}
            style={{
              maxWidth: 200,
              objectFit: 'contain',
              alignSelf: 'center'
            }}
          />
          <VerticalSpacer size={15} />

          <HorizontalAppStoreLinks />
          <VerticalSpacer size={15} />

          <BaseText
            text={'All rights reserved by [this company]'}
            color={Colors.LIGHT_GREY_00}
          />
          <VerticalSpacer size={20} />
        </FlexBox>
      </FlexBox>
    </ThemedAppContainer>
  )
}

const ArtistProfile = ({ profile }: { profile: ApiContract.Response.PublicArtistProfile}) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const artist = profile.artist

  function openLinkSelector() {
    setIsActive(true)
  }

  return (
    <FlexBox vertical={true}>
      <FlexBox>
        <ProfileAvatar
          onClick={openLinkSelector}
          src={artist?.profile_pic?.url} size={150}
        />
      </FlexBox>
      <VerticalSpacer size={15} />
      <BaseText
        text={artist?.username}
        size={22}
        styles={{fontWeight: 'bold'}}
      />
      <VerticalSpacer size={10} />
      <TextLink
        text={"View on Mobile"}
        onClick={openLinkSelector}
      />
      <VerticalSpacer size={20} />

      <FlexBox
        wrap={'wrap'}
        margin={10}
      >
        {profile.images.map((image) => {
          return (
            <FlexBox
              style={{
                maxWidth: '45vw',
                maxHeight: '45vw',
              }}
            >
              <img
                key={`image-${image._id}`}
                src={image.url}
                alt={`storefront-${image._id}`}
                onClick={openLinkSelector}
                style={{
                  margin: 5,
                  borderRadius: 4,
                  maxWidth: '100%',
                  objectFit: 'cover'
                }}
              />
            </FlexBox>
          )
        })}
      </FlexBox>
      <VerticalSpacer size={30} />
      <StoreLinkModal isActive={isActive} setIsActive={setIsActive} />
    </FlexBox>
  )
}