import React from 'react'
import { ModalBase, TModalStateProps } from '../Modal'
import { FlexBox } from '../view/FlexLayouts'
import { BaseText, Text24 } from '../../../theme/CustomText'
import { VerticalContentDivider, VerticalSpacer } from '../ViewElements'
import LocalImages from '../../images/LocalImages'
import { BaseButton } from '../Buttons'
import { Colors } from '../../../theme/Theme'

export default function WalkInModal(props: TModalStateProps) {
  const { isActive, setIsActive } = props

  return (
    <ModalBase
      isActive={isActive}
      setIsActive={setIsActive}
      shouldCloseOnEsc={true}
    >
      <FlexBox vertical={true} margin={15}>
        <Text24 text={'Scan QR code to get started'} />
        <VerticalSpacer size={10} />
        <img
          src={LocalImages.APP_ICON}
          alt={'qr-code-generated-image'}
          style={{
            width: 400,
            objectFit: 'contain',
            alignSelf: 'center'
          }}
        />
        <VerticalSpacer size={10} />

        <VerticalContentDivider />

        <FlexBox>
          <BaseText
            text={'New guests will show up here'}
            styles={{
              margin: 50
            }}
          />
        </FlexBox>

        <VerticalSpacer size={15} />
        <BaseButton
          action={() => setIsActive(false)}
          text={"Close"}
          background={Colors.LIGHT_GREY_00}
        />
      </FlexBox>
    </ModalBase>
  )
}