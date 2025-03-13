import React, { useState } from 'react'
import { ModalBase } from '../components/Modal'
import { ContainerWithHeaderCloseButton } from '../components/modal/ModalViewComps'
import { Colors } from '../../theme/Theme'
import { BaseButton, CircleButton } from '../components/Buttons'
import { WarningTextBlock } from '../components/HorizontalMessageBox'
import { SInputTextArea, VerticalSpacer } from '../components/ViewElements'
import { BaseText } from '../../theme/CustomText'

interface IDenyInquiryProps {
  onDenied: (reason: string) => void
}
export default function DenyInquiryModal(props: IDenyInquiryProps) {
  const { onDenied } = props
  const [isVisible, setIsVisible] = useState(false)
  const [text, setText] = useState("")

  function close() {
    setIsVisible(false)
  }

  function denyInquiry(reason: string) {
    onDenied(reason)
    setText("")
    close()
  }

  return (
    <React.Fragment>
      <CircleButton
        icon={'fa-times'}
        color={Colors.LIGHT_GREY_00}
        onClick={() => setIsVisible(true)}
      />

      <ModalBase isActive={isVisible} setIsActive={setIsVisible} shouldCloseOnEsc={true}>
        <ContainerWithHeaderCloseButton close={close} heading={"Deny Inquiry"}>
          <WarningTextBlock
            text={"Please provide a reason you are denying this tattoo request"}
          />
          <VerticalSpacer size={25} />
          <BaseButton
            action={() => denyInquiry("No availability")}
            text={"No availability"}
          />
          <VerticalSpacer size={10} />
          <BaseButton
            action={() => denyInquiry("Tattoo is not in my scope of practice")}
            text={"Not in my scope of practice"}
          />
          <VerticalSpacer size={10} />
          <BaseText text={"Other"} />
          <VerticalSpacer size={5} />
          <SInputTextArea
            onChange={(value) => setText(value as string)}
            value={text}
            minHeight={75}
          />
          <VerticalSpacer size={10} />
          {text &&
            <BaseButton
              action={() => denyInquiry(text)}
              text={"Submit custom reason"}
            />
          }
          <VerticalSpacer size={30} />
          <BaseButton
            action={close}
            text={"Go back"}
            background={'transparent'}
          />
        </ContainerWithHeaderCloseButton>
      </ModalBase>
    </React.Fragment>
  )
}