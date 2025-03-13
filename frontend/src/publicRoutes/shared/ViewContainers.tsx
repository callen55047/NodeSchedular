import React, { ReactNode } from 'react'
import { RChildren } from '../../types/GenericTypes'
import { Colors } from '../../theme/Theme'
import { FlexBox } from '../../views/components/view/FlexLayouts'
import { PublicSubtitle, PublicTitle, PortalBannerLogo } from './ViewComponents'
import { Icon, VerticalSpacer } from '../../views/components/ViewElements'
import { ErrorTextBlock, SuccessTextBlock } from '../../views/components/HorizontalMessageBox'

const FixedWidthVerticalContainer = (props: RChildren) => {
  return (
    <div>
      <FlexBox
        vertical={true}
        justify={'flex-start'}
        style={{
          background: Colors.DARK_00,
          margin: 25,
          padding: 15,
          borderRadius: 10,
          border: '2px solid white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          maxWidth: 500
        }}
      >
        {props.children}
      </FlexBox>
      <VerticalSpacer size={50} />
    </div>
  )
}

interface IPublicHeaderProps {
  title: string,
  subtitle: string,
  error?: string
}
const PublicHeaderWithErrorMessage = (props: IPublicHeaderProps) => {
  const { title, subtitle, error } = props

  return (
    <>
      <PortalBannerLogo />
      <PublicTitle text={title} />
      <VerticalSpacer size={10} />
      <PublicSubtitle text={subtitle} />
      <VerticalSpacer size={25} />
      {!!error &&
        <>
          <ErrorTextBlock text={error} />
          <VerticalSpacer size={15} />
        </>
      }
    </>
  )
}

interface ISuccessOrContentProps {
  success: boolean,
  message: string,
  content: ReactNode
}
const SuccessOrContent = (props: ISuccessOrContentProps) => {
  const { success, message, content } = props

  if (success) {
    return <>
      <>
        <SuccessTextBlock text={message} />
        <VerticalSpacer size={15} />
        <Icon name={'fa-check'} color={Colors.GREEN} rSize={6} />
        <VerticalSpacer size={15} />
      </>
    </>
  }

  return <>
    {content}
  </>
}

export {
  FixedWidthVerticalContainer,
  PublicHeaderWithErrorMessage,
  SuccessOrContent
}