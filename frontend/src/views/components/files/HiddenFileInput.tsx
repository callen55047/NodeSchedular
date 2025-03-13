import React from 'react'

interface IHiddenFileInputProps {
  inputRef: React.MutableRefObject<HTMLInputElement | null>,
  onFilesSelected: (files: FileList | null) => void
}
export default function HiddenFileInput(props: IHiddenFileInputProps) {
  const { inputRef, onFilesSelected } = props

  return (
    <input
      ref={inputRef}
      style={{ display: 'none' }}
      onChange={(e) => onFilesSelected(e.target.files)}
      type='file'
      id='image-upload'
      name='image'
      accept='image/png, image/jpeg, image/jpg'
    />
  )
}