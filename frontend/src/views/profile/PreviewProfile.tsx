import { FlexBox } from '../components/view/FlexLayouts'
import { BaseButton, SmallIconButton } from '../components/Buttons'
import React, { useContext, useState } from 'react'
import { ModalBase } from '../components/Modal'
import { Icon, VerticalSpacer } from '../components/ViewElements'
import { Text24 } from '../../theme/CustomText'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { NavContext } from '../navigator/NavContext'
import { EMetaType, IFile } from '../../internal/models/File'
import ItemListState from '../../internal/state/ItemListState'
import { PhoneDisplay } from './profilePreview/PreviewViewComps'
import { Colors } from '../../theme/Theme'

export default function PreviewProfile() {
  const { currentUser } = useContext(AppInstance)
  const { fileManager } = useContext(NavContext)
  const [isActive, setIsActive] = useState(false)

  const images = fileManager.getFilesByType(EMetaType.STOREFRONT)
  const { currentItem, changeIndex } = ItemListState<IFile>(images)

  return (
    <>
      <SmallIconButton
        icon={`fa-eye`}
        action={() => setIsActive(true)}
        tooltip={"Preview profile"}
        background={Colors.DARK_GREY}
      />

      <ModalBase
        isActive={isActive}
        setIsActive={setIsActive}
        shouldCloseOnEsc={true}
      >
        <FlexBox vertical={true} margin={25}>
          <Text24 text={'NS Mobile Preview'} />

          <VerticalSpacer size={20} />

          <FlexBox>
            <FlexBox vertical={true}>
              <Icon
                name={'fa-arrow-circle-left'}
                onClick={() => changeIndex(false)}
                color={'white'}
                rSize={2}
              />
            </FlexBox>

            <PhoneDisplay
              device={'iPhone'}
              profileImage={currentUser!.profile_pic}
              storefrontImage={currentItem}
            />

            <FlexBox vertical={true}>
              <Icon
                name={'fa-arrow-circle-right'}
                onClick={() => changeIndex(true)}
                color={'white'}
                rSize={2}
              />
            </FlexBox>
          </FlexBox>

        </FlexBox>
      </ModalBase>
    </>
  )
}