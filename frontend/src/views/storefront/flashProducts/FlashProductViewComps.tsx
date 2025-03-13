import React from 'react'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { Icon, VerticalSpacer } from '../../components/ViewElements'
import { BaseText } from '../../../theme/CustomText'
import { FlexBox } from '../../components/view/FlexLayouts'
import { IFlashProduct } from '../../../internal/models/products/FlashProduct'

interface INewFlashCardProps {
  onClick: () => void
}
const CreateNewFlashCard = ({ onClick }: INewFlashCardProps) => {

  return (
    <FlashProductCard flash={null} onClick={onClick} />
  )
}

interface IFlashProductProps {
  flash: IFlashProduct | null,
  onClick: () => void
}
const FlashProductCard = (props: IFlashProductProps) => {
  const { flash, onClick } = props

  return (
    <div
      className={'simple-hover'}
      style={{
        position: 'relative',
        borderRadius: BorderRadius.r10,
        overflow: 'clip',
        background: `linear-gradient(to bottom, red, ${Colors.DARK_GREY})`,
        textAlign: 'center',
        width: 150,
        height: 150
      }}
      onClick={onClick}
    >
      <FlexBox
        vertical={true}
        style={{
          height: '100%'
        }}
      >
        {flash ?
          <img
            src={flash.image.url}
            style={{
              objectFit: 'cover',
              height: '100%'
            }}
          />
          :
          <Icon
            name={'fa-tags'}
            rSize={3}
            margin={0}
            color={Colors.DARK_00}
          />
        }
      </FlexBox>

      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: 25,
          bottom: 0,
          zIndex: 1,
          background: 'rgba(117,117,117,0.56)'
        }}
      >
        <BaseText
          text={flash?.title ?? 'New Flash'}
          styles={{
            margin: 5,
            fontWeight: 'bold'
          }}
        />
      </div>
    </div>
  )
}

interface IFlashModalHeaderProps {
  title: string,
  onClose: () => void
}
const FlashModalHeader = (props: IFlashModalHeaderProps) => {
  const { title, onClose } = props

  return (
    <>
      <FlexBox
        style={{
          background: `linear-gradient(to bottom, red, ${Colors.DARK_GREY})`,
          padding: 25
        }}
        justify={'space-between'}
      >
        <BaseText text={title} size={18} />
        <Icon
          name={'fa-times'}
          rSize={1.6}
          margin={0}
          onClick={onClose}
        />
      </FlexBox>
      <VerticalSpacer size={20} />
    </>
  )
}

export {
  CreateNewFlashCard,
  FlashProductCard,
  FlashModalHeader
}