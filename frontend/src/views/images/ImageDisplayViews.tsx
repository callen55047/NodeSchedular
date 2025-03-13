import React from 'react'
import ImageURI from './ImageURI'
import LocalImages from './LocalImages'
import Devices from '../../internal/Devices'
import { BorderRadius } from '../../theme/Theme'
import { FlexBox } from '../components/view/FlexLayouts'

type TImageAttachmentViewProps = {
  imageUri?: string
}
const ImageAttachmentView = (props: TImageAttachmentViewProps) => {
  return (
    <img
      src={props.imageUri || ImageURI.DEFAULT_PROFILE_IMAGE}
      alt={'image display view'}
      style={{
        maxWidth: 150
      }}
    />
  )
}

type TProfileAvatarProps = {
  src?: string,
  size?: number,
  margin?: string | number,
  onClick?: () => void
}
const ProfileAvatar = (props: TProfileAvatarProps) => {
  const { margin, src, size, onClick } = props

  const sizingStyles = !!size ? {
    width: size,
    height: size
  } : {
    maxWidth: '50px',
    maxHeight: '100%'
  }

  return(
    <div style={{
      ...sizingStyles,
      overflow: 'clip',
      borderRadius: size || 50,
      margin
    }}>
      <img
        src={src || LocalImages.DEFAULT_AVATAR}
        alt={'profile-avatar'}
        onClick={onClick}
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          cursor: onClick ? 'pointer' : undefined,
        }}
      />
    </div>
  )
}

interface IDeviceImageViewProps {
  url: string | undefined,
  imageWidth?: number
}
const DeviceImageView = ({ url, imageWidth }: IDeviceImageViewProps) => {
  const width = imageWidth || 250
  const height = width * Devices.iPhone13.screen.aspect_ratio

  return (
    <FlexBox vertical={true} style={{
      width,
      height,
      border: '1px solid gray',
      borderRadius: BorderRadius.r4,
      overflow: 'clip'
    }}>
      <img
        src={url}
        alt='device-image-view'
        style={{
          height: 'inherit',
          objectFit: 'cover',
          borderRadius: BorderRadius.r4
        }}
      />
    </FlexBox>
  )
}

export {
  ImageAttachmentView,
  ProfileAvatar,
  DeviceImageView
}