import React, { useState } from 'react'
import { ModalBase } from '../Modal'
import { FlexBox } from '../view/FlexLayouts'
import { Text24, Text48 } from '../../../theme/CustomText'
import { SimpleButton } from '../Buttons'
import { RChildren } from '../../../types/GenericTypes'
import { HorizontalSpacer, VerticalSpacer } from '../ViewElements'
import { InvisibleChildWrapper } from './ModalViewComps'
import { EGlobalZIndex } from '../../../types/Constants'

type TConfirmationModalProps = RChildren & {
  action: () => void,
  title?: string
  text?: string
}
export default function ConfirmationModal(props: TConfirmationModalProps) {
  const { action, children, text, title } = props
  const [isVisible, setIsVisible] = useState(false)

  function deny() {
    setIsVisible(false)
  }

  function allow() {
    setIsVisible(false)
    action()
  }

  return (
    <React.Fragment>
      <InvisibleChildWrapper onClick={() => setIsVisible(true)}>
        {children}
      </InvisibleChildWrapper>

      <ModalBase
        isActive={isVisible}
        setIsActive={setIsVisible}
        shouldCloseOnEsc={false}
        zIndex={EGlobalZIndex.CONFIRMATION_MODAL}
      >
        <FlexBox style={{ maxWidth: 600, textAlign: 'center' }}>
          <FlexBox vertical={true} margin={20}>
            <Text48 text={title || 'Please confirm'} />
            <VerticalSpacer size={15} />
            <Text24 text={text || 'This action is permanent and cannot be undone.'} />
            <VerticalSpacer size={50} />
            <FlexBox>
              <SimpleButton theme={'SECONDARY'} text={'Cancel'} action={deny} />
              <HorizontalSpacer size={15} />
              <SimpleButton theme={'DANGER'} text={'Confirm'} action={allow} />
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </ModalBase>
    </React.Fragment>
  )
}