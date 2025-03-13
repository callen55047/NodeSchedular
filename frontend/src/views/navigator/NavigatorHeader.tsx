import React, { useContext, useState } from 'react'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { NavContext } from './NavContext'
import { Colors, Dimensions } from '../../theme/Theme'
import { HorizontalSpacer, SImage, Spacer } from '../components/ViewElements'
import LocalImages from '../images/LocalImages'
import { BaseText, Text24 } from '../../theme/CustomText'
import { FlexBox } from '../components/view/FlexLayouts'
import { PopoverButtonList } from '../components/popover/PopOverVariants'
import { NAVIGATOR_VIEWS } from './INavigatorView'
import { ProfileAvatar } from '../images/ImageDisplayViews'
import WalkInModal from '../components/modal/WalkInModal'

export default function NavigatorHeader() {
  const { currentUser } = useContext(AppInstance)
  const { currentView, requestNewComponent } = useContext(NavContext)
  const [walkInModalActive, setWalkInModalActive] = useState(false)

  return (
    <div
      className={'navigator-header'}
      style={{
        height: Dimensions.NAV_HEADER_HEIGHT,
        display: 'flex',
        background: Colors.DARK_00
      }}
    >
      <SImage src={LocalImages.BANNER_LOGO} />
      <BaseText text={'Beta'} alignment={'center'} />
      <Spacer size={2} />
      <FlexBox vertical={true}>
        <Text24 text={currentView.name} />
      </FlexBox>

      <Spacer size={2} />
      <PopoverButtonList
        title={"Actions"}
        options={[
          {
            icon: 'fa-qrcode',
            text: 'Walk-In Client',
            action: () => setWalkInModalActive(true)
          },
          {
            icon: 'fa-calendar',
            text: 'Create Session',
            action: () => requestNewComponent(NAVIGATOR_VIEWS.MESSAGING)
          },
          {
            icon: 'fa-image',
            text: 'Update Storefront',
            action: () => requestNewComponent(NAVIGATOR_VIEWS.PROFILE)
          },
          {
            icon: 'fa-cc-stripe',
            text: 'Stripe Dashboard',
            action: () => requestNewComponent(NAVIGATOR_VIEWS.SETTINGS)
          },
        ]}
      />
      <HorizontalSpacer size={100} />
      {/*TODO: create notifications popover*/}
      {/*<Icon*/}
      {/*  name={'fa-bell'}*/}
      {/*  color={'white'}*/}
      {/*  onClick={() => setIsNotificationsPopup(true)}*/}
      {/*/>*/}
      <ProfileAvatar
        src={currentUser?.profile_pic?.url}
        size={50}
        margin={'5px 20px'}
        onClick={() => requestNewComponent(NAVIGATOR_VIEWS.PROFILE)}
      />

      <WalkInModal
        isActive={walkInModalActive}
        setIsActive={setWalkInModalActive}
      />
    </div>
  )
}