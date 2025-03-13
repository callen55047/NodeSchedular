import React, { useContext, useEffect, useRef, useState } from 'react'
import { FlexBox } from '../view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { Icon, VerticalSpacer } from '../ViewElements'
import { ModalBase, TModalStateProps } from '../Modal'
import { EMetaType, IFile } from '../../../internal/models/File'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import DataSizing from '../../../internal/DataSizing'
import { IMessageBoxType, MessageBoxSwitch } from '../HorizontalMessageBox'
import HiddenFileInput from '../files/HiddenFileInput'

type TFileUploadModalProps = TModalStateProps & {
  newFileCallback: (file: IFile) => void,
  imageType: EMetaType
}

/**
 * This component gets file from computer, uploads to server,
 * and returns a base64 generated IFIle object from services
 */
export default function FileUploadModel(props: TFileUploadModalProps) {
  const { api } = useContext(AppInstance)
  const { isActive, setIsActive, newFileCallback, imageType } = props
  const [status, setStatus] = useState<IMessageBoxType>({ style: 'none', text: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const InputRef = useRef<HTMLInputElement | null>(null)

  const resetAndClose = () => {
    if (isLoading) {
      return
    }

    setStatus({style: 'none', text: ''})
    setIsActive(false)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }


  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onFilesSelected(event.dataTransfer.files);
  };

  const onFilesSelected = async (files: FileList | null) => {
    setIsDragging(false)
    if (files?.length === 0 || isLoading) {
      return
    }

    const file = files![0]
    if (file.size > DataSizing.megabytes(5)) {
      setStatus({ style: 'warning', text: 'File size is too large. Max allowance <= 5mb' })
      return
    }

    setIsLoading(true)
    const response = await api.file.upload({ file, type: imageType })
    if (response?.file) {
      newFileCallback(response.file)
      setIsLoading(false)
      resetAndClose()
    } else {
      setStatus({ style: 'error', text: 'ERROR: Could not upload file type' })
    }
  }

  return (
    <ModalBase isActive={isActive} setIsActive={setIsActive} shouldCloseOnEsc={false}>
      <FlexBox vertical={true} margin={"0 25px"}>
        <FlexBox justify={'flex-end'}>
          <Icon
            name={'fa-times'}
            color={'white'}
            rSize={1.5}
            onClick={resetAndClose}
          />
        </FlexBox>

        <VerticalSpacer size={10} />

        <div
          onClick={() => InputRef.current?.click()}
          style={{
            border: '1px dashed grey',
            borderRadius: BorderRadius.r4,
            padding: 20,
            background: Colors.DARK_GREY,
            cursor: 'pointer',
            backgroundColor: isDragging ? Colors.LIGHT_GREY_00 : 'transparent',
            minWidth: 400
          }}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <FlexBox>
            <FlexBox
              vertical={true}
              style={{ textAlign: 'center' }}
            >
              <FlexBox>
                <Icon name={'fa-upload'} rSize={3} color={'white'} />
              </FlexBox>
              <VerticalSpacer size={10} />
              {isLoading ?
                <FlexBox>
                  <Icon name={'fa-gear fa-spin'} rSize={2} color={'white'} />
                </FlexBox>
                :
                <>
                  <BaseText
                    text={"Drag and drop or click here"}
                    size={20}
                    styles={{fontWeight: 'bold'}}
                    alignment={'center'}
                  />
                  <VerticalSpacer size={5} />
                  <BaseText text={"to upload your image (max 5mb)"} alignment={'center'} />
                </>
              }
            </FlexBox>
          </FlexBox>
        </div>
        <VerticalSpacer size={20} />
        <MessageBoxSwitch {...status} />
        <VerticalSpacer size={20} />
      </FlexBox>

      <HiddenFileInput
        inputRef={InputRef}
        onFilesSelected={onFilesSelected}
      />
    </ModalBase>
  )
}