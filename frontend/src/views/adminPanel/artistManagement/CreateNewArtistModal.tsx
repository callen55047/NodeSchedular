import React, { useContext, useState } from 'react'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { ModalBase } from '../../components/Modal'
import { ContainerWithHeaderCloseButton } from '../../components/modal/ModalViewComps'
import { FlexBox } from '../../components/view/FlexLayouts'
import { SInput, VerticalSpacer } from '../../components/ViewElements'
import { BaseButton } from '../../components/Buttons'
import { IAccount } from '../../../internal/models/Account'
import { BaseText } from '../../../theme/CustomText'
import { ErrorTextBlock } from '../../components/HorizontalMessageBox'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { toast } from 'react-toastify'
import { ApiContract } from '../../../contracts/ApiContract'

interface ICreateArtistProps {
  onNewArtist: (artist: IAccount) => void
}
export default function CreateNewArtistModal(props: ICreateArtistProps) {
  const { runBlocking, api } = useContext(AppInstance)
  const { onNewArtist } = props
  const [isVisible, setIsVisible] = useState(false)
  const [info, setInfo] = useState({} as ApiContract.Props.RegisterUser)
  const [error, setError] = useState("")

  function createArtist() {
    if (!info.email || !info.username) {
      setError("Enter valid username and email")
      return
    }
// TODO: test sending manual password in
    runBlocking(async () => {
      const newArtist = await api.admin.onboardArtist(info)
      if (newArtist) {
        onNewArtist(newArtist)
        toast.success("Artist successfully created!")
        close()
      } else {
        setError("Email or username is already taken")
      }
    })
  }

  function close() {
    setIsVisible(false)
    setInfo({} as ApiContract.Props.RegisterUser)
    setError("")
  }

  return (
    <React.Fragment>
      <button
        style={{
          background: Colors.GREEN,
          borderRadius: BorderRadius.r4,
          border: 'none',
          color: Colors.OFF_WHITE,
          padding: "4px 8px",
          cursor: 'pointer'
        }}
        onClick={() => setIsVisible(true)}
      >
        <BaseText text={"Create new artist"} size={16} styles={{ fontWeight: 'bold' }} />
      </button>

      <ModalBase isActive={isVisible} setIsActive={setIsVisible} shouldCloseOnEsc={true}>
        <ContainerWithHeaderCloseButton close={close} heading={'Create New Artist'}>

          <FlexBox vertical={true}>
            {error &&
              <ErrorTextBlock text={error} />
            }
            <VerticalSpacer size={20} />

            <BaseText text={"Email"} />
            <VerticalSpacer size={5} />
            <SInput
              onChange={(v) => setInfo({...info, email: v })}
              value={info.email}
              type={"text"}
            />
            <VerticalSpacer size={20} />

            <BaseText text={"Username"} />
            <VerticalSpacer size={5} />
            <SInput
              onChange={(v) => setInfo({...info, username: v })}
              value={info.username}
              type={"text"}
            />
            <VerticalSpacer size={20} />

            <BaseText text={"Password"} />
            <VerticalSpacer size={5} />
            <SInput
              onChange={(v) => setInfo({...info, password: v })}
              value={info.password}
              type={"text"}
            />
            <VerticalSpacer size={5} />
            <BaseText
              text={"If no password is provided, we will auto generate one for them."}
              color={Colors.LIGHT_GREY_00}
            />
          </FlexBox>

          <VerticalSpacer size={50} />
          <BaseButton
            action={createArtist}
            text={'Create'}
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