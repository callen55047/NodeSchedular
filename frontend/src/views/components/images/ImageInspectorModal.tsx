import React, { useState } from 'react'
import { IFile } from '../../../internal/models/File'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { ModalBase } from '../Modal'
import { FlexBox } from '../view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { VerticalContentDivider, VerticalSpacer } from '../ViewElements'
import { SimpleButton } from '../Buttons'

interface IImageInspectorModalProps {
  file: IFile,
  width?: number,
  height?: number,
}

export default function ImageInspectorModal(props: IImageInspectorModalProps) {
  const { file, width, height } = props
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <img
        key={`file-view-${file._id}`}
        src={file.url}
        alt={'file-default-view'}
        style={{
          objectFit: 'cover',
          width,
          height,
          borderRadius: BorderRadius.r10,
          margin: 5,
          cursor: 'pointer'
        }}
        onClick={() => setIsActive(true)}
      />

      <ModalBase
        key={`file-expanded-view-${file._id}`}
        isActive={isActive}
        setIsActive={setIsActive}
        shouldCloseOnEsc={true}
      >
        <FlexBox vertical margin={15} style={{ overflow: 'auto' }}>
          <BaseText text={"Image Inspector"} size={18} />

          <VerticalContentDivider fullWidth />

          <img
            key={`file-large-view-${file._id}`}
            src={file.url}
            alt={'file-expanded-view'}
            style={{
              objectFit: 'cover',
              width: 500,
              borderRadius: BorderRadius.r10,
              margin: 5,
            }}
          />

          <VerticalContentDivider fullWidth />

          <FlexBox justify={'flex-end'}>
            <SimpleButton
              theme={'SECONDARY'}
              text={'Close'}
              action={() => setIsActive(false)}
            />
          </FlexBox>
        </FlexBox>
      </ModalBase>
    </>
  )
}