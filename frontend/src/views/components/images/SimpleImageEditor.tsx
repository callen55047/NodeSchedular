import React, { useContext, useRef } from 'react'
import { IFile } from '../../../internal/models/File'
import LocalImages from '../../images/LocalImages'
import { Icon } from '../ViewElements'
import { FlexBox } from '../view/FlexLayouts'
import ImageEditor from '../../../tools/ImageEditor'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'

interface IImageEditorProps {
  file?: IFile | null,
  onNewLocalFile: (file: IFile) => void,
  size: number,
  canEdit: boolean
}

export default function SimpleImageEditor(props: IImageEditorProps) {
  const { runBlocking, api } = useContext(AppInstance)
  const { file, onNewLocalFile, size, canEdit } = props

  const targetFileUrl = file?.url || LocalImages.APP_ICON
  const InputRef = useRef<HTMLInputElement | null>(null)
  const editor = new ImageEditor()
  const editBackground = 'rgba(232,232,232,0.53)'
  const isLocalFile = !!file?.local_file

  function onContainerClick() {
    if (!canEdit) {
      return
    }
    InputRef.current?.click()
  }

  function rotateImage() {
    if (file) {
      runBlocking(async () => {
        await editor.withIFile(file, api)
        await editor.rotate(-90)
        const rotatedImage = await editor.toLocalFile()
        onNewLocalFile(rotatedImage)
      })
    }
  }

  async function onFileSelected(files: FileList | null) {
    if (!files || files?.length < 1) {
      return
    }
    const file = files[0]
    const localFile = await editor.withNativeFile(file).toLocalFile()
    onNewLocalFile(localFile)
  }

  return (
    <FlexBox justify={'flex-start'}>
      <div
        onClick={onContainerClick}
        style={{
          position: 'relative',
          cursor: canEdit ? 'pointer' : undefined,
          margin: 20
        }}
      >
        {canEdit &&
          <div style={{
            position: 'absolute',
            padding: 5,
            margin: 3,
            bottom: 0,
            backgroundColor: editBackground,
            borderRadius: 4,
            textAlign: 'center',
            width: 'calc(100% - 15px)'
          }}>
            <text>Change Picture</text>
          </div>
        }

        <img
          className={canEdit ? 'blue-outline-hover' : undefined}
          src={targetFileUrl}
          alt="current-local-image"
          style={{
            width: size,
            height: size,
            objectFit: 'cover',
            borderRadius: size
          }}
        />
        <input
          ref={InputRef}
          style={{ display: 'none' }}
          onChange={(e) => onFileSelected(e.target.files)}
          type="file"
          id="image-upload"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
        />
      </div>

      {(canEdit && isLocalFile) &&
        <FlexBox vertical={true} justify={'flex-start'}>
          <FlexBox>
            <Icon
              name={'fa-rotate-left'}
              title={'Rotate image'}
              rSize={2}
              color={'white'}
              margin={0}
              onClick={rotateImage}
              style={{
                padding: 10,
                backgroundColor: editBackground,
                borderRadius: 4
              }}
            />
          </FlexBox>
        </FlexBox>
      }
    </FlexBox>
  )
}