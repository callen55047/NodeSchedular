import { FlexBox } from '../../components/view/FlexLayouts'
import { ProfileAvatar } from '../../images/ImageDisplayViews'
import React from 'react'
import Devices from '../../../internal/Devices'
import LocalImages from '../../images/LocalImages'
import { IFile } from '../../../internal/models/File'

interface IPhoneDisplayProps {
  device: string,
  storefrontImage: IFile | null,
  profileImage: IFile | null
}
const PhoneDisplay = (props: IPhoneDisplayProps) => {
  const { storefrontImage, profileImage } = props

  const deviceRatio = Devices.Pixel6.screen.aspect_ratio
  const deviceImage = LocalImages.PIXEL_CUTOUT


  const deviceWidth = 300
  const devicePadding = 34

  return (
    <div style={{
      position: 'relative',
      width: deviceWidth,
      height: deviceWidth * deviceRatio,
      margin: 25
    }}>
      <img
        src={deviceImage}
        alt={'device-preview'}
        style={{
          width: 'inherit',
          height: 'inherit',
          objectFit: 'contain',
          zIndex: 2
        }}
      />
      <FlexBox
        vertical={true}
        justify={'flex-start'}
        style={{
          position: 'absolute',
          width: deviceWidth - devicePadding,
          height: 370,
          top: 185,
          left: devicePadding / 2,
          zIndex: 1,
          overflow: 'clip'
        }}
      >
        <img
          src={storefrontImage?.url}
          alt={'current-preview'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        <div style={{
          position: 'absolute',
          top: 10,
          left: 10
        }}>
          <ProfileAvatar
            src={profileImage?.url}
            size={45}
          />
        </div>

      </FlexBox>
    </div>
  )
}

export {
  PhoneDisplay
}