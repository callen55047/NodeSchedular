import React, { useContext, useState } from 'react'
import { CreateNewFlashCard, FlashModalHeader } from './FlashProductViewComps'
import { ModalBase } from '../../components/Modal'
import { FlexBox } from '../../components/view/FlexLayouts'
import { Colors } from '../../../theme/Theme'
import { BaseText} from '../../../theme/CustomText'
import { DividerLine, HorizontalSpacer, Icon, VerticalSpacer } from '../../components/ViewElements'
import { StateLabeledInput } from '../../components/Inputs'
import { SimpleButton } from '../../components/Buttons'
import NativeFileOrImageUpload from '../../components/images/NativeFileOrImageUpload'
import { IFlashProduct } from '../../../internal/models/products/FlashProduct'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { EMetaType } from '../../../internal/models/File'

interface ICreateFlashProductModalProps {
  onCreated: () => void
}
export default function CreateFlashProductModal(props: ICreateFlashProductModalProps) {
  const { api, runBlocking } = useContext(AppInstance)
  const { onCreated } = props
  const [isVisible, setIsVisible] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [flashProduct, setFlashProduct] = useState<IFlashProduct>({} as IFlashProduct)

  const canCreate = !!flashProduct.title &&
    !!flashProduct.quantity &&
    !!flashProduct.price &&
    !!flashProduct.width &&
    !!flashProduct.height &&
    !!image

    function handleImageUpload(files: FileList) {
    setImage(files[0])
  }

  function handleFileRemove() {
    setImage(null)
  }

  function createFlashProduct() {
    runBlocking(async () => {
      const serverFile = await api.file.upload({ file: image!, type: EMetaType.FLASH })
      const flashWithImage = { ...flashProduct, image_id: serverFile!.file._id}
      const res = await api.flashProduct.create(flashWithImage)
      if (res) {
        onCreated()
        resetAndClose()
      }
    })
  }

  function resetAndClose() {
    setImage(null)
    setFlashProduct({} as IFlashProduct)
    setIsVisible(false)
  }

  return (
    <>
      <CreateNewFlashCard onClick={() => setIsVisible(true)} />

      <ModalBase
        isActive={isVisible}
        setIsActive={setIsVisible}
        shouldCloseOnEsc={false}
      >
        <FlexBox
          vertical={true}
          style={{
            background: Colors.DARK_GREY
          }}
        >
          <FlashModalHeader
            title={'New Flash Sale'}
            onClose={resetAndClose}
          />

          <FlexBox vertical={true} margin={15}>
            <FlexBox>
              <FlexBox vertical={true}>
                <BaseText text={'Design image'} alignment={'center'} />
                <VerticalSpacer size={5} />
                <FlexBox flexBias={1}>
                  <NativeFileOrImageUpload
                    nativeFile={image}
                    onFileSelected={handleImageUpload}
                    onFileRemoved={handleFileRemove}
                  />
                </FlexBox>
              </FlexBox>

              <HorizontalSpacer size={15} />

              <FlexBox vertical={true}>
                <StateLabeledInput
                  state={flashProduct}
                  setState={setFlashProduct}
                  property={'title'}
                />
                <VerticalSpacer size={5} />
                <StateLabeledInput
                  state={flashProduct}
                  setState={setFlashProduct}
                  property={'description'}
                />
                <VerticalSpacer size={5} />
                <FlexBox>
                  <StateLabeledInput
                    state={flashProduct}
                    setState={setFlashProduct}
                    property={'price'}
                    type={'number'}
                  />
                  <HorizontalSpacer size={10} />
                  <StateLabeledInput
                    state={flashProduct}
                    setState={setFlashProduct}
                    property={'quantity'}
                    type={'number'}
                  />
                </FlexBox>
                <VerticalSpacer size={5} />

                <FlexBox>
                  <StateLabeledInput
                    state={flashProduct}
                    setState={setFlashProduct}
                    property={'width'}
                    type={'number'}
                  />
                  <HorizontalSpacer size={10} />
                  <StateLabeledInput
                    state={flashProduct}
                    setState={setFlashProduct}
                    property={'height'}
                    type={'number'}
                  />
                </FlexBox>
                <BaseText
                  text={'Size in centimeters (cm)'}
                  color={Colors.LIGHT_GREY_00}
                  size={14}
                  alignment={'center'}
                />
                <VerticalSpacer size={5} />

                <FlexBox>
                  <StateLabeledInput
                    state={flashProduct}
                    setState={setFlashProduct}
                    property={'start_date'}
                    type={'date'}
                  />
                  <HorizontalSpacer size={10} />
                  <StateLabeledInput
                    state={flashProduct}
                    setState={setFlashProduct}
                    property={'end_date'}
                    type={'date'}
                  />
                </FlexBox>
                <BaseText
                  text={'Optionally provide start and end dates'}
                  color={Colors.LIGHT_GREY_00}
                  size={14}
                  alignment={'center'}
                  />
              </FlexBox>
            </FlexBox>

            <VerticalSpacer size={15} />
            <DividerLine />
            <VerticalSpacer size={15} />

            <FlexBox justify={'flex-end'}>
              <SimpleButton
                theme={"SECONDARY"}
                text={'Cancel'}
                action={resetAndClose}
              />
              <HorizontalSpacer size={15} />
              <SimpleButton
                theme={"PRIMARY"}
                text={'Create'}
                action={createFlashProduct}
                isDisabled={!canCreate}
              />
            </FlexBox>

          </FlexBox>
        </FlexBox>
      </ModalBase>
    </>
  )
}