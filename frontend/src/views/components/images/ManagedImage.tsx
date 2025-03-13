import React, { useState } from 'react'
import { EMetaType, IFile } from '../../../internal/models/File'
import FileUploadModel from '../modal/FileUploadModel'
import LocalImages from '../../images/LocalImages'

type TManagedImageProps = {
  file: IFile | null,
  type: EMetaType,
  onNewFile: (file: IFile) => void,
  maxHeight: number,
  canEdit: boolean
}
export default function ManagedImage(props: TManagedImageProps) {
  const { file, onNewFile, maxHeight, canEdit, type } = props
  const [isActive, setIsActive] = useState(false)

  // TODO: some jpeg types are not displaying...
  const targetFileUrl = file?.url || LocalImages.APP_ICON

  function handleContainerClick() {
    if (canEdit) {
      setIsActive(true)
    }
  }

  // TODO: improve on style
  return (
    <React.Fragment>
      <div
        onClick={handleContainerClick}
        style={{
          display: 'inline-block',
          cursor: canEdit ? 'pointer' : undefined
        }}
      >
        {/*TODO: adding overlapping edit button*/}
        {/*<BaseButton*/}
        {/*    action={handleContainerClick}*/}
        {/*    text={"Edit"}*/}
        {/*    icon={"fa-edit"}*/}
        {/*    styles={{*/}
        {/*        float: "right",*/}
        {/*    }}*/}
        {/*/>*/}
        <img
          className={canEdit ? 'blue-outline-hover' : undefined}
          src={targetFileUrl}
          alt='managed-image'
          style={{
            maxHeight,
            margin: 20
          }}
        />

      </div>

      <FileUploadModel
        isActive={isActive}
        setIsActive={setIsActive}
        imageType={type}
        newFileCallback={onNewFile}
      />
    </React.Fragment>
  )
}