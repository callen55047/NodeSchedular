import React from 'react'
import { IFile } from '../../../internal/models/File'
import { BorderRadius } from '../../../theme/Theme'
import { FlexBox } from '../view/FlexLayouts'
import { HorizontalSpacer, Icon, VerticalSpacer } from '../ViewElements'
import { BaseText } from '../../../theme/CustomText'
import ItemListState from '../../../internal/state/ItemListState'

type TImageStackProps = {
  images: IFile[]
}
export default function ImageStack(props: TImageStackProps) {
  const { images } = props
  const { currentItem, currentIndex, changeIndex } = ItemListState<IFile>(images)

  if (images.length < 1) {
    return null
  }

  return (
    <FlexBox
      vertical={true}
      key={`image-key-${currentItem?._id}`}
    >
      <img
        src={currentItem?.url}
        alt={'inquiry-attachment'}
        style={{
          maxWidth: 250,
          maxHeight: 250,
          borderRadius: BorderRadius.r10,
          margin: 20
        }}
      />

      <VerticalSpacer size={5} />

      <FlexBox justify={'center'}>
        <BaseText text={`${currentIndex + 1} / ${images.length}`} />
      </FlexBox>

      <VerticalSpacer size={5} />

      <FlexBox justify={'center'}>
        <Icon
          name={'fa-chevron-left'}
          color={"white"}
          onClick={() => changeIndex(false)}
        />
        <HorizontalSpacer size={20} />
        <Icon
          name={'fa-chevron-right'}
          color={"white"}
          onClick={() => changeIndex(true)}
        />
      </FlexBox>
    </FlexBox>
  )
}