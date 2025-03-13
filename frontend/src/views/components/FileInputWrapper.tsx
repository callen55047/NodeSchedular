import { RChildren } from '../../types/GenericTypes'
import React, { useRef } from 'react'
import { SUPPORTED_FILE_TYPES } from '../../internal/models/File'

type TFileInputWrapperProps = RChildren & {
  onFileSelection: (files: FileList | null) => void,
}
export default function FileInputWrapper(props: TFileInputWrapperProps) {
  const { children, onFileSelection } = props

  const InputRef = useRef<HTMLInputElement | null>(null)

  return (
    <React.Fragment>
          <span
            onClick={() => InputRef.current?.click()}
            style={{ display: 'inherit', cursor: 'pointer' }}
          >{children}</span>

      <input
        ref={InputRef}
        style={{ display: 'none' }}
        onChange={(e) => onFileSelection(e.target.files)}
        type={'file'}
        id={'file-upload'}
        name={'image'}
        accept={SUPPORTED_FILE_TYPES}
      />
    </React.Fragment>
  )
}