import React, { useContext, useState } from 'react'
import { AppInstance } from '../../../../appEntry/appContainer/AppContext'
import { ArtistDetailContext } from './ArtistDetailContext'
import { toast } from 'react-toastify'
import { FlexBox } from '../../../components/view/FlexLayouts'
import { BaseText } from '../../../../theme/CustomText'
import { SInput, VerticalSpacer } from '../../../components/ViewElements'
import ConfirmationModal from '../../../components/modal/ConfirmationModal'
import { TextButton } from '../../../components/Buttons'
import { Colors } from '../../../../theme/Theme'
import FromUtcDate from '../../../../internal/DateAndTime'

export default function ArtistDetailActionsTab() {
  const { runBlocking, api } = useContext(AppInstance)
  const { artist, updateArtist } = useContext(ArtistDetailContext)
  const [newPassword, setNewPassword] = useState('')
  const [deleteTextInput, setDeleteTextInput] = useState('')
  const canDelete = deleteTextInput === 'please archive'
  const canDisplayActions = artist.deleted_at === null

  // TODO: add account restore button

  function resendOnboardingEmail() {
    runBlocking(async () => {
      const res = await api.admin.resendOnboarding(artist!._id)
      if (res) {
        toast.success('New onboarding email sent!')
      } else {
        toast.error('Error: Could not create new email')
      }
    })
  }

  function sendNewPassword() {
    runBlocking(async () => {
      const res = await api.admin.setUserPassword(artist._id, newPassword)
      if (res?.success) {
        toast.success('New password has been set')
        setNewPassword('')
      } else {
        toast.error('Error: Unable to set new password')
      }
    })
  }

  function archiveAccount() {
    runBlocking(async () => {
      const res = await api.admin.archiveAccount(artist!._id)
      if (res?.success) {
        toast.success('Account has been archived.')
        updateArtist({ ...artist!, deleted_at: FromUtcDate().utcString() })
      } else {
        toast.error('Error: Unable to archive account')
      }
    })
  }

  function restoreAccount() {
    runBlocking(async () => {
      const res = await api.admin.restoreAccount(artist!._id)
      if (res?.success) {
        toast.success('Account has been restored!')
        updateArtist({ ...artist!, deleted_at: null })
      } else {
        toast.error('Error: Unable to restore account')
      }
    })
  }

  if (!canDisplayActions) {
    return <FlexBox vertical={true}>
      <BaseText text={'Account has been archived'} alignment={'center'} />
      <VerticalSpacer size={10} />
      <TextButton action={restoreAccount} text={'Restore account?'} />
    </FlexBox>
  }

  return (
    <>
      <BaseText text={'Resend onboarding'} size={24} styles={{ fontWeight: 'bold' }} />
      <VerticalSpacer size={5} />
      <FlexBox justify={'flex-start'}>
        <ConfirmationModal
          action={resendOnboardingEmail}
          title={'Create New Onboarding Email'}
          text={'Warning, this will create a new password for the artist, and invalid any previous onboarding emails'}
        >
          <TextButton
            action={() => {
            }}
            text={'Send email'}
          />
        </ConfirmationModal>
      </FlexBox>
      <VerticalSpacer size={15} />

      <BaseText text={'Set new password'} size={24} styles={{ fontWeight: 'bold' }} />
      <VerticalSpacer size={5} />
      <BaseText text={'Password'} />
      <FlexBox justify={'flex-start'}>
        <SInput
          onChange={setNewPassword}
          value={newPassword}
          type={'text'}
        />
        {newPassword.length > 0 &&
          <TextButton
            action={sendNewPassword}
            text={'Confirm'}
          />
        }
      </FlexBox>
      <VerticalSpacer size={15} />

      <BaseText text={'Archive account'} size={24} styles={{ fontWeight: 'bold' }} />
      <VerticalSpacer size={5} />
      <BaseText
        text={'To archive account, enter "please archive"'}
        color={Colors.DANGER_RED}
      />
      <VerticalSpacer size={5} />
      <SInput
        onChange={setDeleteTextInput}
        value={deleteTextInput}
        type={'text'}
      />
      <VerticalSpacer size={5} />
      {canDelete &&
        <FlexBox justify={'flex-start'}>
          <ConfirmationModal
            action={archiveAccount}
            title={'Archive Artist Account'}
            text={'WARNING: This will delete all marketing media, archive the account' +
              ' and, obviously, prevent them from logging in anymore. ' +
              'Only continue is you are absolutely sure you want to archive this account. ' +
              'If you do this by mistake, you will be fired.'}
          >
            <TextButton
              color={Colors.RED_00}
              action={() => {
              }}
              text={'Archive Account'}
            />
          </ConfirmationModal>
        </FlexBox>
      }
    </>
  )
}