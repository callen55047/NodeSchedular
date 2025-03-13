import React, { useContext, useState } from 'react'
import { AppInstance } from '../appEntry/appContainer/AppContext'
import { IAccountUpdate, ProfileContext } from './profile/ProfileContext'
import ProfileInformation from './profile/ProfileInformation'
import ProfileFeaturedImages from './profile/ProfileFeaturedImages'
import { EMetaType, IFile, LOCAL_FILE_ID } from '../internal/models/File'
import { toast } from 'react-toastify'

export default function ProfileView() {
  const { currentUser, setCurrentUser, api, runBlocking, logger } = useContext(AppInstance)
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false)
  const [localProfile, setLocalProfile] = useState<IAccountUpdate>({ ...currentUser! } as IAccountUpdate)

  function updateProfile(values: IAccountUpdate) {
    setLocalProfile({ ...localProfile, ...values })
  }

  async function handleEditSave() {
    if (!isInEditMode) {
      setIsInEditMode(true)
      return
    }

    const refUser = { ...currentUser! } as IAccountUpdate
    if (JSON.stringify(refUser) !== JSON.stringify(localProfile)) {
      runBlocking(async () => {

        let newProfilePic: IFile | null = null
        if (localProfile.profile_pic?._id === LOCAL_FILE_ID) {
          // delete existing profile picture first
          if (currentUser?.profile_pic?._id) {
            await api.file.delete(currentUser?.profile_pic?._id)
          }
          const res = await api.file.upload({
            file: localProfile.profile_pic.local_file!,
            type: EMetaType.PROFILE
          })
          newProfilePic = res!.file
        }

        const updatedProfile = await api.account.updateProfile({
          first_name: localProfile.first_name,
          last_name: localProfile.last_name,
          birthdate: localProfile.birthdate || undefined,
          gender: localProfile.gender,
          phone_number: localProfile.phone_number,
          address: localProfile.address,
          bio: localProfile.bio,
          profile_pic: newProfilePic?._id
        })

        if (updatedProfile) {
          const newCurrentUser = { ...currentUser!, ...updatedProfile }
          setCurrentUser(newCurrentUser)
          setLocalProfile({ ...newCurrentUser } as IAccountUpdate)
          toast.success('Profile successfully updated')
        } else {
          toast.error('Failed to update profile')
          logger.error('[ProfileView] failed to update profile. res was NULL')
        }
      })
    }

    resetLocalChanges()
  }

  function resetLocalChanges() {
    setIsInEditMode(false)
    setLocalProfile({ ...currentUser! } as IAccountUpdate)
  }

  const contextData = {
    handleEditSave,
    handleCancel: resetLocalChanges,
    isInEditMode,
    profile: localProfile,
    updateProfile
  }

  return (
    <ProfileContext.Provider value={contextData}>

      <ProfileInformation />

      <ProfileFeaturedImages />

    </ProfileContext.Provider>
  )
}