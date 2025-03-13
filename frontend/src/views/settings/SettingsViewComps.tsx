import React from 'react'
import { Colors } from '../../theme/Theme'
import { BaseButton } from '../components/Buttons'
import { TileHeading3 } from '../components/TileLayout'
import { BaseText } from '../../theme/CustomText'
import { VerticalSpacer } from '../components/ViewElements'

type TTileHeaderWithEdit = {
  name: string,
  isInEditMode: boolean,
  handleEditSave: () => void,
  handleCancel: () => void
}
const TileHeaderWithEditBtn = (props: TTileHeaderWithEdit) => {
  const { name, isInEditMode, handleEditSave, handleCancel } = props
  const EditSavebutton = () => {
    if (isInEditMode) {
      return (
        <div style={{ display: 'flex' }}>
          <BaseButton
            text={`save`}
            icon={'fa-save'}
            iconSize={1}
            background={'rgba(255,255,255,0)'}
            color={Colors.BLUE_00}
            action={handleEditSave}
          />
          <BaseButton
            text={`cancel`}
            icon={'fa-times-circle'}
            iconSize={1}
            background={'rgba(255,255,255,0)'}
            color={Colors.RED_00}
            action={handleCancel}
          />
        </div>
      )

    }
    return <BaseButton
      text={`edit`}
      icon={'fa-edit'}
      iconSize={1}
      background={'rgba(255,255,255,0)'}
      action={handleEditSave}
    />
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <TileHeading3 name={name} />
      <EditSavebutton />
    </div>
  )
}

const SectionHeading = ({ name }: { name: string }) => {
  return <>
    <BaseText text={name} size={18} styles={{ fontWeight: 'bold' }} />
    <VerticalSpacer size={10} />
  </>
}

const SectionBody = ({ text }: { text: string }) => {
  return <BaseText text={text} color={Colors.LIGHT_GREY_00} />
}

export {
  TileHeaderWithEditBtn,
  SectionHeading,
  SectionBody
}