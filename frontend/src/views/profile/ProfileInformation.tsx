import React, { useContext, useEffect } from 'react'
import { Tile, TileRowContainer } from '../components/TileLayout'
import { TileHeaderWithEditBtn } from '../settings/SettingsViewComps'
import { ProfileInputField } from './ProfileViewComps'
import { ProfileContext } from './ProfileContext'
import { FlexBox } from '../components/view/FlexLayouts'
import { IFile } from '../../internal/models/File'
import { TagsField } from './SkillTagsView'
import SimpleImageEditor from '../components/images/SimpleImageEditor'
import DataSizing from '../../internal/DataSizing'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { HorizontalSpacer, VerticalContentDivider, VerticalSpacer } from '../components/ViewElements'
import { BaseIconText, BaseText } from '../../theme/CustomText'
import PreviewProfile from './PreviewProfile'
import ChangePasswordModal from './profileInformation/ChangePasswordModal'
import { IAddress, simplifiedAddress } from '../../internal/models/shared/Address'
import GoogleMaps from '../../internal/plugins/GoogleMaps'
import { ProfileAddressVerification } from './profileInformation/ProfileInfoViewComps'
import { SimpleButton } from '../components/Buttons'
import ShareLinks from '../../internal/sharing/ShareLinks'
import { toast } from 'react-toastify'
import ConfirmationModal from '../components/modal/ConfirmationModal'

let _addressTask: number | undefined

export default function ProfileInformation() {
  const { currentUser, logout } = useContext(AppInstance)
  const { isInEditMode, handleEditSave, handleCancel, profile, updateProfile } = useContext(ProfileContext)
  const verifiedAddress = !!profile.address?.coordinates

  useEffect(() => {
    return () => {
      clearTimeout(_addressTask)
    }
  }, [])

  async function handleNewProfilePic(file: IFile) {
    if (file.local_file && file.local_file?.size > DataSizing.megabytes(5)) {
      toast.error('File size is larger than 5mb')
      return
    }

    updateProfile({ ...profile, profile_pic: file })
  }

  function updateAddressField(field: string, value: string) {
    const updatedAddress = { ...profile.address, [field]: value, coordinates: null } as IAddress
    updateProfile({ ...profile, address: updatedAddress })

    if (updatedAddress.street && updatedAddress.city) {
      clearTimeout(_addressTask)
      _addressTask = setTimeout(async () => {
        const res = await GoogleMaps.getCoordinatesFor(updatedAddress)
        if (typeof res === 'string') {
          toast.error(`[Address validation] ${res}`)
        } else {
          updateProfile({ ...profile, address: { ...updatedAddress, coordinates: res } as IAddress })
        }
      }, 1000)
    }
  }

  return (
    <TileRowContainer>
      <Tile>
        <TileHeaderWithEditBtn
          name={'Contact & Address'}
          isInEditMode={isInEditMode}
          handleEditSave={handleEditSave}
          handleCancel={handleCancel}
        />
        <FlexBox justify={'space-between'}>
          <FlexBox justify={'flex-start'}>
            <SimpleImageEditor
              file={profile.profile_pic}
              onNewLocalFile={handleNewProfilePic}
              size={200}
              canEdit={isInEditMode}
            />
            <HorizontalSpacer size={15} />
            <FlexBox vertical={true} justify={'center'}>
              <FlexBox justify={'flex-start'}>
                <BaseText text={currentUser!.username} size={24} styles={{ fontWeight: 'bold' }} />
                <HorizontalSpacer size={10} />
                {!isInEditMode && <PreviewProfile />}
              </FlexBox>

              <VerticalSpacer size={10} />
              <BaseIconText icon={'fa-user'} text={`${currentUser!.first_name} ${currentUser!.last_name}`} />
              <VerticalSpacer size={5} />
              <BaseIconText icon={'fa-envelope'} text={currentUser!.email} />
              <VerticalSpacer size={5} />
              <BaseIconText icon={'fa-map-marker'} text={simplifiedAddress(currentUser?.address)} />
              <VerticalSpacer size={5} />
              <BaseIconText icon={'fa-newspaper-o'} text={currentUser!.bio} />
            </FlexBox>
          </FlexBox>

          {!isInEditMode &&
            <FlexBox vertical={true} justify={'center'}>
              <BaseText
                text={'Share your Profile'}
                styles={{ fontWeight: 'bold' }}
                size={20}
                alignment={'center'}
              />
              <VerticalSpacer size={10} />

              <SimpleButton
                icon={'fa-instagram'}
                text={'Social Media link'}
                action={() => ShareLinks.account(currentUser!).copy()}
                theme={'PRIMARY'}
                slim={true}
              />
            </FlexBox>
          }
        </FlexBox>

        <FlexBox wrap={'wrap'}>
          <ProfileInputField
            name={'First name'}
            value={profile.first_name}
            onChange={(value) => updateProfile({ ...profile, first_name: value })}
          />
          <ProfileInputField
            name={'Last name'}
            value={profile.last_name}
            onChange={(value) => updateProfile({ ...profile, last_name: value })}
          />
          <ProfileInputField
            name={'Phone'}
            value={profile.phone_number}
            onChange={(value) => updateProfile({ ...profile, phone_number: value })}
          />
          <ProfileInputField
            name={'Date of birth'}
            type={'date'}
            value={profile.birthdate}
            onChange={(value) => updateProfile({ ...profile, birthdate: value })}
          />

          <ProfileInputField
            name={'Biography'}
            textArea={true}
            minHeight={100}
            value={profile.bio}
            onChange={(value) => updateProfile({ ...profile, bio: value })}
          />
        </FlexBox>

        <VerticalContentDivider />

        <FlexBox wrap={'wrap'}>
          <ProfileInputField
            name={'Street'}
            value={profile.address?.street}
            onChange={(value) => updateAddressField('street', value)}
          />
          <ProfileInputField
            name={'City'}
            value={profile.address?.city}
            onChange={(value) => updateAddressField('city', value)}
          />
          <ProfileInputField
            name={'Province'}
            value={profile.address?.province_state}
            onChange={(value) => updateAddressField('province_state', value)}
          />
          <ProfileInputField
            name={'Postal code'}
            value={profile.address?.postal_zip}
            onChange={(value) => updateAddressField('postal_zip', value)}
          />
          <ProfileInputField
            name={'Country'}
            value={profile.address?.country}
            onChange={(value) => updateAddressField('country', value)}
          />
          <ProfileAddressVerification
            verified={verifiedAddress}
          />
        </FlexBox>

        <VerticalContentDivider />

        <TagsField />
        <VerticalSpacer size={30} />

        <FlexBox justify={'flex-start'}>
          <ChangePasswordModal />
          <HorizontalSpacer size={15} />
          <ConfirmationModal
            title={'Are you sure you want to logout?'}
            text={'This will bring you back to the login page.'}
            action={logout}
          >
            <SimpleButton
              theme={"CLEAR"}
              text={'Logout?'}
              action={() => {}}
            />
          </ConfirmationModal>
        </FlexBox>
      </Tile>
    </TileRowContainer>
  )
}
