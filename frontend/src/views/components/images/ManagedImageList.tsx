import React from 'react'
import { EMetaType } from '../../../internal/models/File'
import { FlexBox } from '../view/FlexLayouts'
import { Icon, VerticalSpacer } from '../ViewElements'
import ConfirmationModal from '../modal/ConfirmationModal'
import { Colors } from '../../../theme/Theme'
import { DeviceImageView } from '../../images/ImageDisplayViews'
import { moveItemBackward, moveItemForward } from '../../../internal/ObjectHelpers'
import FileDragAndDropContainer from '../files/FileDragAndDropContainer'
import FileUploadArea from '../files/FileUploadArea'
import { IFileStateManager } from '../../../internal/state/FileStateManager'
import { toast } from 'react-toastify'

type TManagedImageListProps = {
  imageType: EMetaType,
  fileManager: IFileStateManager,
  imageWidth?: number
}

export default function ManagedImageList(props: TManagedImageListProps) {
  const { imageType, fileManager, imageWidth } = props

  const images = fileManager.getFilesByType(imageType)
  const canUploadMore = images.length < 8

  function adjustOrder(current: number, target: number) {
    if (target >= 0 && target <= 5) {
      if (target > current) {
        fileManager.updateFileListOrder(moveItemForward(images, target))
      } else {
        fileManager.updateFileListOrder(moveItemBackward(images, target))
      }
    }
  }

  function handleFilesSelected(files: FileList) {
    fileManager.uploadAndAddFiles(files, EMetaType.STOREFRONT)
  }

  return (
    <FileDragAndDropContainer
      isActive={canUploadMore}
      onFilesSelected={handleFilesSelected}
    >
      {images.map((image, index) => {
        return (
          <FlexBox vertical={true} margin={'0px 20px'}>

            <DeviceImageView url={image.url} imageWidth={imageWidth} />

            <VerticalSpacer size={5} />

            <FlexBox>
              <Icon
                name={'fa-arrow-circle-left'}
                onClick={() => adjustOrder(index, index - 1)}
                color={'white'}
                rSize={2}
                margin={5}
              />
              <ConfirmationModal
                title={'Delete image?'}
                action={async () => {
                  await fileManager.deleteFile(image)
                  toast.success('Image removed')
                }}
              >
                <Icon
                  name={'fa-times'}
                  color={Colors.RED_00}
                  rSize={2}
                  onClick={() => {
                  }}
                  margin={5}
                />
              </ConfirmationModal>
              <Icon
                name={'fa-arrow-circle-right'}
                onClick={() => adjustOrder(index, index + 1)}
                color={'white'}
                rSize={2}
                margin={5}
              />
            </FlexBox>
          </FlexBox>
        )
      })}

      {canUploadMore &&
        <FileUploadArea
          onFilesSelected={handleFilesSelected}
        />
      }
    </FileDragAndDropContainer>
  )
}