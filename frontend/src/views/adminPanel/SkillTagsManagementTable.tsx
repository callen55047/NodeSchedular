import React from 'react'
import { useContext } from 'react'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import AsyncStateFetch from '../../internal/state/AsyncStateFetch'
import { ISkill } from '../../internal/models/Skill'
import { AdminPageHeading } from './AdminPanelViewComps'
import { HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import { FlexBox } from '../components/view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { Colors } from '../../theme/Theme'
import { TextButton } from '../components/Buttons'
import { BaseTable } from '../components/Tables'
import SkillTagEditorRow from './skillTagsManagement/SkillTagEditorRow'

export default function SkillTagsManagementTable() {
  const { api, runBlocking } = useContext(AppInstance)
  const skillTask = AsyncStateFetch(() => api.skills.allReferences())

  function deleteSkill(skill: ISkill) {
    runBlocking(async () => {
      await api.skills.remove(skill)
      skillTask.reload()
    })
  }

  function updateSkill(skill: ISkill, name: string) {
    runBlocking(async () => {
      await api.skills.update(skill, name)
      skillTask.reload()
    })
  }

  return (
    <>
      <AdminPageHeading text={'Skill Tags Management'} />
      <VerticalSpacer size={5} />
      <FlexBox justify={'flex-start'}>
        <BaseText
          text={'View all skills that are referenced by artists and users.'}
          color={Colors.LIGHT_GREY_00}
        />
        <HorizontalSpacer size={5} />
        <TextButton action={skillTask.reload} text={'Refresh'} />
      </FlexBox>
      <VerticalSpacer size={5} />

      <BaseTable
        head={
          <tr>
            <th>Name</th>
            <th>References</th>
            <th>Delete</th>
          </tr>
        }
        body={
          <>
            {skillTask.data?.skills.map((skill) => {
              return <SkillTagEditorRow
                skill={skill}
                skills={skillTask.data!.skills}
                accounts={skillTask.data!.accounts}
                deleteSkill={deleteSkill}
                updateSkill={updateSkill}
              />
            })}
          </>
        }
      />
    </>
  )
}