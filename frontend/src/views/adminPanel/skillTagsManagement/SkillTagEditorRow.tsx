import { ISkill } from '../../../internal/models/Skill'
import React, { useState } from 'react'
import { IAccount } from '../../../internal/models/Account'
import { FlexBox } from '../../components/view/FlexLayouts'
import { HorizontalSpacer, SInput } from '../../components/ViewElements'
import { BaseText } from '../../../theme/CustomText'
import { Colors } from '../../../theme/Theme'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import { SimpleButton } from '../../components/Buttons'

interface ISkillTagEditorRowProps {
  skill: ISkill,
  skills: ISkill[],
  accounts: IAccount[],
  deleteSkill: (skill: ISkill) => void,
  updateSkill: (skill: ISkill, name: string) => void,
}

export default function SkillTagEditorRow(props: ISkillTagEditorRowProps) {
  const { skill, skills, accounts, deleteSkill, updateSkill } = props
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(skill.name)

  const accountCount = accounts.filter((a) => {
    return a.skills.filter((s) => s._id === skill._id).length > 0
  }).length

  const isInvalidName = skills.find((s) => {
    return s._id !== skill._id &&
      s.name === name.toLowerCase()
  })

  function cancelUpdate() {
    setEditMode(false)
    setName(skill.name)
  }

  function confirmUpdate() {
    updateSkill(skill, name)
    setEditMode(false)
  }

  return (
    <tr
      key={skill._id}
    >
      <td>
        {editMode ?
          <FlexBox justify={'flex-start'}>
            <SInput onChange={(t) => setName(t)} value={name} />
            <HorizontalSpacer size={5} />
            <SimpleButton
              theme={"CLEAR"}
              text={"Cancel"}
              action={cancelUpdate}
              slim={true}
            />
            <HorizontalSpacer size={5} />
            {!isInvalidName &&
              <SimpleButton
                theme={"SUCCESS"}
                text={"Change"}
                action={confirmUpdate}
                slim={true}
              />
            }
          </FlexBox>
          :
          <FlexBox
            onClick={() => setEditMode(true)}
            justify={'flex-start'}
          >
            <BaseText
              text={skill.name}
              color={Colors.RED_00}
              styles={{ fontWeight: 'bold' }}
              size={16}
            />
          </FlexBox>
        }
      </td>
      <td><BaseText text={`${accountCount}`} size={16} /></td>
      <td>
        {(accountCount < 1 && !editMode) &&
          <ConfirmationModal
            action={() => deleteSkill(skill)}
            title={'Delete Skill?'}
            text={'This skill is not referenced and is safe to delete.'}
          >
            <SimpleButton
              theme={"DANGER"}
              text={"Delete"}
              action={() => {
              }}
              slim={true}
            />
          </ConfirmationModal>
        }
      </td>
    </tr>
  )
}