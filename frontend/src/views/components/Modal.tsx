import React, { ReactNode } from 'react'
import { BorderRadius, Colors } from '../../theme/Theme'
import { HorizontalSpacer, Icon, VerticalSpacer } from './ViewElements'
import Modal from 'react-modal'
import { NoButton, YesButton } from './Buttons'
import { FlexBox } from './view/FlexLayouts'
import { Text24, Text48 } from '../../theme/CustomText'
import { INavigatorView } from '../navigator/INavigatorView'

const ModalColors = {
  BACKGROUND: 'rgb(21 21 21 / 79%)'
}

Modal.setAppElement('#schedular-app-root')

type TModalStateProps = {
  isActive: boolean,
  setIsActive: (newState: boolean) => void
}
type BaseModalProps = TModalStateProps & {
  children: ReactNode,
  shouldCloseOnEsc: boolean,
  isInvisible?: boolean,
  zIndex?: number
}
const ModalBase = (props: BaseModalProps) => {
  const {
    isActive,
    setIsActive,
    children,
    shouldCloseOnEsc,
    isInvisible,
    zIndex
  } = props
  return <Modal
    isOpen={isActive}
    onRequestClose={() => setIsActive(false)}
    shouldCloseOnEsc={shouldCloseOnEsc}
    shouldCloseOnOverlayClick={shouldCloseOnEsc}
    style={{
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: isInvisible ? 'transparent' : Colors.DARK_GREY,
        border: undefined,
        borderRadius: BorderRadius.r10,
        display: 'flex',
        justifyContent: 'space-around',
        padding: 0,
        boxShadow: isInvisible ? 'none' : '0px 0px 8px 5px #00000045'
      },
      overlay: {
        backgroundColor: isInvisible ? 'transparent' : ModalColors.BACKGROUND,
        zIndex
      }
    }}
    contentLabel="mSchedular-overlay"
  >
    {children}
  </Modal>
}

type TLoadingOverlayProps = TModalStateProps & {
  extended?: boolean,
  zIndex?: number
}
const LoadingOverlay = ({ isActive, setIsActive, extended, zIndex }: TLoadingOverlayProps) => {
  return (
    <ModalBase
      isActive={isActive}
      setIsActive={setIsActive}
      shouldCloseOnEsc={false}
      isInvisible={!extended}
      zIndex={zIndex}
    >
      {extended &&
        <FlexBox margin={'5px 10px'}>
          <Text24 text={'Loading... '} />
          <HorizontalSpacer size={10} />
          <Icon
            rSize={1.4}
            margin={0}
            name={'fa-gear fa-spin'}
            color={'white'}
          />
        </FlexBox>
      }
    </ModalBase>
  )
}

type TBeforeUnloadModalProps = TModalStateProps & {
  currentView: INavigatorView,
  onContinue: () => void
}

// TODO: add details about work that is unsaved for extra information
const BeforeUnloadNavModal = (props: TBeforeUnloadModalProps) => {
  const { currentView, isActive, setIsActive, onContinue } = props

  return (
    <ModalBase
      isActive={isActive}
      setIsActive={setIsActive}
      shouldCloseOnEsc={false}
    >
      <FlexBox vertical={true}>
        <Text48 text={`Leaving ${currentView.name}`} />
        <FlexBox vertical={true} margin={20}>
          <Text24 text={'You have unsaved work that will be lost.'} />
          <Text24 text={'Do you want to continue?'} />
        </FlexBox>

        <VerticalSpacer size={20} />
        <FlexBox>
          <NoButton action={() => setIsActive(false)} />
          <YesButton action={() => onContinue()} />
        </FlexBox>
      </FlexBox>
    </ModalBase>
  )
}

export {
  ModalBase,
  LoadingOverlay,
  BeforeUnloadNavModal,
  TModalStateProps
}