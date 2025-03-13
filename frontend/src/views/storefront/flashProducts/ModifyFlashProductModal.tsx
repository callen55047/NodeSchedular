import React, { useContext } from 'react'
import { IFlashProduct } from '../../../internal/models/products/FlashProduct'
import { ModalBase } from '../../components/Modal'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { FlashModalHeader } from './FlashProductViewComps'
import { FlexBox } from '../../components/view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { HorizontalSpacer, VerticalSpacer } from '../../components/ViewElements'
import { SimpleLabelAndValue, StateLabeledInput } from '../../components/Inputs'
import { BaseButton } from '../../components/Buttons'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { toast } from 'react-toastify'
import { NavContext } from '../../navigator/NavContext'
import ConfirmationModal from '../../components/modal/ConfirmationModal'

interface IModifyFlashProductModalProps {
  flashProduct: IFlashProduct | null,
  close: () => void,
  onDelete: () => void
}
export default function ModifyFlashProductModal(props: IModifyFlashProductModalProps) {
  const { api, runBlocking } = useContext(AppInstance)
  const { inquiries } = useContext(NavContext)
  const { flashProduct, close, onDelete } = props

  const flashInquiries = inquiries.filter((f) => f.flash_id === flashProduct?._id)
  const canDelete = flashInquiries.length < 1

  function deleteFlash() {
    runBlocking(async () => {
      const res = await api.flashProduct.deleteFlash(flashProduct!._id)
      if (res?.success) {
        toast.success('Flash product deleted')
        onDelete()
        close()
      } else {
        toast.error('Unable to delete flash product')
      }
    })
  }

  if (!flashProduct) {
    return  null
  }

  return (
    <ModalBase
      isActive={!!flashProduct}
      setIsActive={close}
      shouldCloseOnEsc={true}
    >
      <FlexBox
        vertical={true}
        style={{
          background: Colors.DARK_GREY
        }}
      >
        <FlashModalHeader
          title={'Flash Product'}
          onClose={close}
        />

        <FlexBox vertical={true} margin={15}>
          <FlexBox>
            <FlexBox vertical={true}>
              <BaseText text={'Design image'} alignment={'center'} />
              <VerticalSpacer size={5} />
              <FlexBox flexBias={1}>
                <img
                  src={flashProduct.image.url}
                  style={{
                    objectFit: 'cover',
                    width: 350,
                    margin: '0 20px',
                    borderRadius: BorderRadius.r4
                  }}
                />
              </FlexBox>
            </FlexBox>

            <HorizontalSpacer size={15} />

            <FlexBox vertical={true}>
              <SimpleLabelAndValue
                label={'Title'}
                value={flashProduct.title}
              />
              <VerticalSpacer size={5} />

              <SimpleLabelAndValue
                label={'Description'}
                value={flashProduct.description}
              />
              <VerticalSpacer size={5} />

              <SimpleLabelAndValue
                label={'Price'}
                value={flashProduct.price}
              />
              <VerticalSpacer size={5} />

              <FlexBox justify={'flex-start'}>
                <SimpleLabelAndValue
                  label={'Quantity'}
                  value={flashProduct.quantity}
                />
                <HorizontalSpacer size={10} />
                <SimpleLabelAndValue
                  label={'Available'}
                  value={flashProduct.quantity - flashInquiries.length}
                />
              </FlexBox>
              <VerticalSpacer size={5} />

              <SimpleLabelAndValue
                label={'Size'}
                value={`Width: ${flashProduct.width}cm, Height: ${flashProduct.height}cm`}
              />
              <VerticalSpacer size={5} />

              <SimpleLabelAndValue
                label={'Dates'}
                value={`From ${flashProduct.start_date} to ${flashProduct.end_date}`}
              />
              <VerticalSpacer size={15} />

              {canDelete &&
                <ConfirmationModal
                  action={deleteFlash}
                  title={"Delete Flash Product"}
                >
                  <BaseButton
                    action={() => {}}
                    text={'Delete flash'}
                    background={Colors.RED_00}
                  />
                </ConfirmationModal>
              }
            </FlexBox>

            <VerticalSpacer size={20} />

          </FlexBox>
        </FlexBox>

        </FlexBox>
    </ModalBase>
  )
}