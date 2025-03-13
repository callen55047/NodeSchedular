import React, { useContext } from 'react'
import { ModalBase } from '../Modal'
import { FlexBox } from '../view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { VerticalSpacer } from '../ViewElements'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { SimpleButton } from '../Buttons'
import { EGlobalZIndex } from '../../../types/Constants'

export default function SessionHasExpiredModal() {
  const { sessionExpired, logout } = useContext(AppInstance)

  if (!sessionExpired) {
    return null
  }

  return (
    <ModalBase
      isActive={sessionExpired}
      setIsActive={() => {}}
      shouldCloseOnEsc={false}
      zIndex={EGlobalZIndex.SESSION_EXPIRED_MODAL}
    >
      <FlexBox justify={'flex-start'} style={{ maxWidth: 300 }}>
        <FlexBox vertical={true} margin={20}>
          <BaseText text={'Your session has expired'} size={18} styles={{ fontWeight: 'bold' }} />
          <VerticalSpacer size={15} />
          <SimpleButton
            theme={'PRIMARY'}
            text={'Log back in'}
            action={logout}
          />
        </FlexBox>
      </FlexBox>
    </ModalBase>
  )
}