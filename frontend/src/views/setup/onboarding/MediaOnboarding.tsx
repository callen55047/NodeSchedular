import React, { useContext, useEffect, useState } from 'react'
import SetupContainerView from '../SetupContainerView'
import { Colors } from '../../../theme/Theme'
import { BaseText } from '../../../theme/CustomText'
import SimpleImageEditor from '../../components/images/SimpleImageEditor'
import { EMetaType, IFile, LOCAL_FILE_ID } from '../../../internal/models/File'
import { VerticalSpacer } from '../../components/ViewElements'
import ManagedImageList from '../../components/images/ManagedImageList'
import FileStateManager from '../../../internal/state/FileStateManager'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { SimpleButton } from '../../components/Buttons'
import { FlexBox } from '../../components/view/FlexLayouts'
import { IAccount } from '../../../internal/models/Account'
import { SequenceContext } from '../../../appEntry/sequenceController/SequenceContext'
import { toast } from 'react-toastify'
import DataSizing from '../../../internal/DataSizing'

export default function MediaOnboarding() {
  const { currentUser, api, runBlocking, logger } = useContext(AppInstance)
  const { goToStep } = useContext(SequenceContext)
  const [localUser, setLocalUser] = useState<IAccount>({ ...currentUser! })
  const fileManager = FileStateManager()

  const canContinue =
    fileManager.getFilesByType(EMetaType.STOREFRONT).length > 2 && !!localUser.profile_pic

  useEffect(() => {
    fileManager.fetchAllRemoteFiles()
  }, [])

  function onNewProfilePic(file: IFile) {
    if (file.local_file && file.local_file?.size > DataSizing.megabytes(5)) {
      toast.error('File size is larger than 5mb')
      return
    }

    setLocalUser({ ...localUser, profile_pic: file })
  }

  function completeStep() {
    runBlocking(async () => {
      let newProfilePic: IFile | null = null
      if (localUser.profile_pic?._id === LOCAL_FILE_ID) {
        if (currentUser?.profile_pic?._id) {
          await api.file.delete(currentUser?.profile_pic?._id)
        }
        const res = await api.file.upload({
          file: localUser.profile_pic.local_file!,
          type: EMetaType.PROFILE
        })
        newProfilePic = res!.file
      }

      const res = await api.account.updateProfile({
        profile_pic: newProfilePic?._id
      })
      if (!res) {
        await logger.error('[MediaOnboarding] Failed to update profile picture')
        toast.error('Failed to update profile picture')
        return
      }
      goToStep('STRIPE_ACCOUNT')
    })
  }

  return (
    <SetupContainerView title={'Profile and Storefront Images'} current={4}>
      <FlexBox>
        <SimpleImageEditor
          onNewLocalFile={onNewProfilePic}
          size={150}
          canEdit={true}
          file={localUser.profile_pic}
        />
      </FlexBox>
      <VerticalSpacer size={15} />

      <BaseText
        text={'Upload your storefront images to feature on your profile'}
        color={Colors.LIGHT_GREY_00}
      />
      <VerticalSpacer size={10} />
      <ManagedImageList
        imageType={EMetaType.STOREFRONT}
        fileManager={fileManager}
        imageWidth={150}
      />
      <VerticalSpacer size={25} />
      {canContinue &&
        <SimpleButton
          theme={'SUCCESS'}
          text={'Continue'}
          action={completeStep}
        />
      }
    </SetupContainerView>
  )
}