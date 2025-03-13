import React, { useContext, useState } from 'react'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { ISkill } from '../../internal/models/Skill'
import { FlexBox } from '../components/view/FlexLayouts'
import { HorizontalSpacer, Icon } from '../components/ViewElements'
import { BaseText } from '../../theme/CustomText'
import { Colors } from '../../theme/Theme'
import { LabelAndFieldContainer } from './ProfileViewComps'
import { ProfileContext } from './ProfileContext'
import SkillTagsEditorModal from './skillTags/SkillTagsEditorModal'

const SkillTagStyle = {
  backgroundColor: '#E30C0C',
  fontSize: 14,
  fontWeight: 'bold',
  color: 'white',
  padding: '5px 10px',
  margin: '5px 10px',
  borderRadius: 10
}

const TagsField = () => {
  const { currentUser, runBlocking, api, setCurrentUser } = useContext(AppInstance)
  const { isInEditMode } = useContext(ProfileContext)
  const skills = currentUser?.skills || []
  const canCreateNew = skills.length < 10

  function deleteSkill(skill: ISkill) {
    runBlocking(async () => {
      const response = await api.skills.remove(skill)
      if (response?.success) {
        const newSkills = currentUser!.skills.filter((s) => s._id !== skill._id)
        setCurrentUser({ ...currentUser!, skills: newSkills })
      }
    })
  }

  return <LabelAndFieldContainer name={'Associated tags'}>
    <FlexBox wrap={'wrap'} justify={'flex-start'}>
      {skills.map(skill => {
        return <Tag skill={skill} onDelete={deleteSkill} />
      })}

      {(isInEditMode && canCreateNew) &&
        <SkillTagsEditorModal />
      }
    </FlexBox>
  </LabelAndFieldContainer>
}

type TTagProps = {
  skill: ISkill,
  onDelete: (skill: ISkill) => void
}
const Tag = (props: TTagProps) => {
  const { isInEditMode } = useContext(ProfileContext)
  const { skill, onDelete } = props

  return <FlexBox style={{ ...SkillTagStyle }}>
    <BaseText
      text={skill!.name!}
      styles={{ margin: 0, alignSelf: 'center' }}
    />
    <HorizontalSpacer size={5} />

    {isInEditMode &&
      <Icon
        name={'fa-times'}
        color={'black'}
        margin={0}
        onClick={() => onDelete(skill)}
      />
    }
  </FlexBox>
}

export {
  TagsField
}