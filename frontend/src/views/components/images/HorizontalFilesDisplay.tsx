import { FlexBox } from '../view/FlexLayouts'
import { IFile } from '../../../internal/models/File'
import React from 'react'
import ImageInspectorModal from './ImageInspectorModal'
import { BaseText } from '../../../theme/CustomText'

interface IHorizontalImageViewProps {
  files: IFile[],
  width: number,
  title?: string
}

export default function HorizontalFilesDisplay(props: IHorizontalImageViewProps) {
  const { files, width, title } = props

  return (
    <FlexBox vertical>
      <BaseText text={title || 'Files'} />
      <FlexBox justify={'flex-start'} style={{ overflow: 'auto' }}>
        {files.map((file) => {
          return (
            <ImageInspectorModal file={file} width={width} />
          )
        })}
      </FlexBox>
    </FlexBox>
  )
}