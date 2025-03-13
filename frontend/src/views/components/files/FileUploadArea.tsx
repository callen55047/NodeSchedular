import React, { useRef } from 'react'
import { FlexBox } from '../view/FlexLayouts'
import { Icon, VerticalSpacer } from '../ViewElements'
import { BaseText } from '../../../theme/CustomText'
import HiddenFileInput from './HiddenFileInput'

interface IFileUploadArea {
  onFilesSelected: (files: FileList) => void
}
export default function FileUploadArea(props: IFileUploadArea) {
  const { onFilesSelected } = props
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleFilesSelected(files: FileList | null) {
    if (files && files.length > 0) {
      onFilesSelected(files)
    }
  }

  return (
    <>
      <div
        style={{
          minWidth: 250,
          margin: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          justifyContent: 'center'
        }}
        onClick={() => inputRef.current?.click()}
      >
        <FlexBox>
          <Icon name={'fa-upload'} rSize={2} color={'white'} />
        </FlexBox>
        <VerticalSpacer size={10} />
        <BaseText
          text={'Drag and drop or click here'}
          size={20}
          styles={{ fontWeight: 'bold' }}
          alignment={'center'}
        />
        <VerticalSpacer size={5} />
        <BaseText text={'to upload your image (max 5mb)'} alignment={'center'} />
      </div>

      <HiddenFileInput
        inputRef={inputRef}
        onFilesSelected={handleFilesSelected}
      />
    </>
  )
}