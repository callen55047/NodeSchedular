import React, { useContext, useState } from 'react'
import { Colors } from '../../../theme/Theme'
import { ModalBase } from '../../components/Modal'
import { ContainerWithHeaderCloseButton } from '../../components/modal/ModalViewComps'
import { FlexBox } from '../../components/view/FlexLayouts'
import { SInput, VerticalSpacer } from '../../components/ViewElements'
import { BaseButton, SimpleButton } from '../../components/Buttons'
import { BaseText } from '../../../theme/CustomText'
import { ErrorTextBlock } from '../../components/HorizontalMessageBox'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { toast } from 'react-toastify'

export default function ChangePasswordModal() {
  const { runBlocking, api } = useContext(AppInstance)
  const [isVisible, setIsVisible] = useState(false)
  const [info, setInfo] = useState({ currentPassword: "", newPassword: "", confirm: "" })
  const [error, setError] = useState("")

  function confirmPasswordChange() {
    if (!info.currentPassword || !info.newPassword) {
      setError("Please enter all fields")
      return
    }

    if (info.newPassword !== info.confirm) {
      setError("New passwords do not match!")
      return
    }

    if (info.newPassword.length < 10) {
      setError("Password must be at least 10 characters")
      return
    }

    runBlocking(async () => {
      const success = await api.account.changePassword(info.currentPassword, info.newPassword)
      if (success) {
        toast.success("Password has been changed!")
        close()
      } else {
        setError("Current password is incorrect")
      }
    })
  }

  function close() {
    setIsVisible(false)
  }

  return (
    <React.Fragment>
      <SimpleButton
        theme={'SECONDARY'}
        text={'Change Password'}
        action={() => setIsVisible(true)}
      />

      <ModalBase isActive={isVisible} setIsActive={setIsVisible} shouldCloseOnEsc={true}>
        <ContainerWithHeaderCloseButton close={close} heading={'Change password'}>

          <FlexBox vertical={true}>
            {error &&
              <ErrorTextBlock text={error} />
            }
            <VerticalSpacer size={20} />

            <BaseText text={"Current password"} />
            <VerticalSpacer size={5} />
            <SInput
              onChange={(v) => setInfo({...info, currentPassword: v })}
              value={info.currentPassword}
              type={"password"}
            />
            <VerticalSpacer size={40} />

            <BaseText text={"New password"} />
            <VerticalSpacer size={5} />
            <SInput
              onChange={(v) => setInfo({...info, newPassword: v })}
              value={info.newPassword}
              type={"password"}
            />
            <VerticalSpacer size={10} />

            <BaseText text={"Confirm password"} />
            <VerticalSpacer size={5} />
            <SInput
              onChange={(v) => setInfo({...info, confirm: v })}
              value={info.confirm}
              type={"password"}
            />
          </FlexBox>

          <VerticalSpacer size={50} />
          <BaseButton
            action={confirmPasswordChange}
            text={'Change'}
            background={Colors.GREEN}
          />
          <VerticalSpacer size={10} />
          <BaseButton
            action={close}
            text={'Cancel'}
            background={'transparent'}
          />
        </ContainerWithHeaderCloseButton>
      </ModalBase>
    </React.Fragment>
  )
}