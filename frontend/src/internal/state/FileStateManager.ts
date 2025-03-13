import { useContext, useState } from 'react'
import { EMetaType, IFile } from '../models/File'
import _ from 'lodash'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { EMetadataKeys, updateOrCreateMetadataWithKey } from '../models/Shared'
import { toast } from 'react-toastify'
import success = toast.success

interface IFileStateManager {
  getFileById: (id: string) => IFile | null,
  getFilesByType: (type: EMetaType) => IFile[],
  addNewFile: (file: IFile) => void,
  uploadAndAddFiles: (files: FileList | null, type: EMetaType) => void,
  updateFileListOrder: (fileList: IFile[]) => void,
  deleteFile: (file: IFile) => Promise<void>,
  fetchAllRemoteFiles: () => Promise<void>,
}

const FileStateManager = (): IFileStateManager => {
  const { api, runBlocking } = useContext(AppInstance)
  const [localFiles, setLocalFiles] = useState<IFile[]>([])

  return {

    getFileById: (id: string): IFile | null => {
      return localFiles.find((f) => f._id === id) || null
    },

    getFilesByType: (type: EMetaType): IFile[] => {
      const files = localFiles.filter((f) => f.metaType === type)

      switch (type) {
        case EMetaType.STOREFRONT:
          return files.sort((a, b) => {
            const aIndex = Number(a.metadata.find((m) => m.key == EMetadataKeys.ORDERING)?.value) ?? -1
            const bIndex = Number(b.metadata.find((m) => m.key == EMetadataKeys.ORDERING)?.value) ?? -1
            return aIndex - bIndex
          })
        default:
          return files
      }
    },

    addNewFile: async (file: IFile) => {
      setLocalFiles([...localFiles, file])
    },

    uploadAndAddFiles: async (files: FileList | null, type: EMetaType) => {
      if (!files || files?.length < 1) {
        return
      }

      const file = files[0]
      const response = await api.file.upload({ file, type })
      if (response?.file) {
        setLocalFiles([...localFiles, response.file])
        toast.success("Image successfully uploaded")
      } else {
        toast.error("Error uploading image")
      }
    },

    updateFileListOrder: async (fileList: IFile[]) => {
      runBlocking(async () => {

        for (let x = 0; x < fileList.length; x++) {
          const file = fileList[x]
          const updatedMetadata = updateOrCreateMetadataWithKey(
            file.metadata,
            EMetadataKeys.ORDERING,
            `${x}`
          )
          const res = await api.file.update(file._id, updatedMetadata)
          if (!res?.success) {
            console.warn(`Failed to update ordering on file: ${file._id}`)
          }

          file.metadata = updatedMetadata
        }

        const fileIds = fileList.map((f) => f._id)
        const filesWithoutTargets = localFiles.filter((f) => !fileIds.includes(f._id))
        setLocalFiles([...filesWithoutTargets, ...fileList])
      })
    },

    deleteFile: async (file: IFile) => {
      runBlocking(async () => {
        const response = await api.file.delete(file._id)
        if (response?.success) {
          const filesWithoutDeleted = localFiles.filter((f) => f._id !== file._id)
          setLocalFiles([...filesWithoutDeleted])
        }
      })
    },

    fetchAllRemoteFiles: async () => {
      const res = await api.file.getAllNonAttachments()
      if (res?.files) {
        const combinedFiles = [...localFiles, ...res.files]
        setLocalFiles(_.uniqBy(combinedFiles, (c) => c._id))
      }
    }
  }
}

export default FileStateManager

export {
  IFileStateManager
}