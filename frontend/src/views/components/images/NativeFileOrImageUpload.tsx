import React, { useEffect } from 'react'
import ImageEditor from '../../../tools/ImageEditor'
import FileUploadArea from '../files/FileUploadArea'
import FileDragAndDropContainer from '../files/FileDragAndDropContainer'
import { BorderRadius } from '../../../theme/Theme'
import { FlexBox } from '../view/FlexLayouts'
import { SimpleButton } from '../Buttons'

interface ILocalFileOrImageUploadProps {
  nativeFile: File | null,
  onFileSelected: (file: FileList) => void,
  onFileRemoved: () => void
}
export default function NativeFileOrImageUpload(props: ILocalFileOrImageUploadProps) {
  const { nativeFile, onFileSelected, onFileRemoved } = props
  const [fileUrl, setFileUrl] = React.useState<string>('')
  const editor = new ImageEditor()

  useEffect(() => {
    if (nativeFile) {
      buildFileUrl()
    }
  }, [nativeFile])

  async function buildFileUrl() {
    const url = await editor.withNativeFile(nativeFile!).getNativeFileUrl()
    setFileUrl(url)
  }

  if (nativeFile) {
    return (
      <div
        style={{
          position: 'relative',
          width: 350,
          margin: '0 20px',
          overflow: 'clip',
          borderRadius: BorderRadius.r4
        }}
      >
        <img
          src={fileUrl}
          style={{
            objectFit: 'cover',
            width: '100%'
          }}
        />
        <FlexBox
          justify={'flex-end'}
          style={{
            position: 'absolute',
            top: 5,
            right: 5
          }}
        >
          <SimpleButton
            theme={"DANGER"}
            text={"Remove"}
            action={onFileRemoved}
            slim={true}
          />
        </FlexBox>
      </div>
    )
  }

  return (
    <FileDragAndDropContainer
      isActive={true}
      onFilesSelected={onFileSelected}
    >
      <FileUploadArea onFilesSelected={onFileSelected} />
    </FileDragAndDropContainer>
  )
}