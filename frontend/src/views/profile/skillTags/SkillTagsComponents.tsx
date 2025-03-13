import { BaseText } from '../../../theme/CustomText'
import { FlexBox } from '../../components/view/FlexLayouts'
import React from 'react'
import { ISkill } from '../../../internal/models/Skill'
import { Colors } from '../../../theme/Theme'

interface ISkillTagsProps {
  skill: ISkill,
  isSelected: boolean,
  onClick: (skill: ISkill) => void
}

const SkillTagPill = ({ skill, isSelected, onClick }: ISkillTagsProps) => {

  return (
    <FlexBox style={{
      backgroundColor: isSelected ? Colors.RED_00 : Colors.DARK_00,
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
      padding: '5px 10px',
      margin: '5px 10px',
      borderRadius: 10,
      cursor: 'pointer',
    }} onClick={() => onClick(skill)}>
      <BaseText
        text={skill!.name!}
        styles={{ margin: '4px 8px', alignSelf: 'center' }}
      />
    </FlexBox>
  )
}

export {
  SkillTagPill
}