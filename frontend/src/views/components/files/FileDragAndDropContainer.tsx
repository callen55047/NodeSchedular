import React, { useState } from 'react'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { RChildren } from '../../../types/GenericTypes'

type IFileDragAndDropContainerProps = RChildren & {
  isActive: boolean
  onFilesSelected: (files: FileList) => void
}

export default function FileDragAndDropContainer(props: IFileDragAndDropContainerProps) {
  const { children, isActive, onFilesSelected } = props
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    if (isActive) {
      setIsDragging(true)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    if (isActive && event.dataTransfer.files.length > 0) {
      onFilesSelected(event.dataTransfer.files)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        border: isActive ? '1px dashed grey' : '1px transparent',
        borderRadius: BorderRadius.r4,
        padding: 20,
        backgroundColor: isDragging ? Colors.LIGHT_GREY_00 : 'transparent'
      }}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}