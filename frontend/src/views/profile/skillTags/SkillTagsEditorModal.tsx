import React, { useContext, useState } from 'react'
import { ModalBase } from '../../components/Modal'
import { SimpleButton } from '../../components/Buttons'
import { FlexBox } from '../../components/view/FlexLayouts'
import { ContainerWithHeaderCloseButton } from '../../components/modal/ModalViewComps'
import { BaseText } from '../../../theme/CustomText'
import { HorizontalSpacer, VerticalContentDivider, VerticalSpacer } from '../../components/ViewElements'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { ProfileInputField } from '../ProfileViewComps'
import { Colors } from '../../../theme/Theme'
import AsyncStateFetch from '../../../internal/state/AsyncStateFetch'
import { ISkill } from '../../../internal/models/Skill'
import { SkillTagPill } from './SkillTagsComponents'
import { toast } from 'react-toastify'

export default function SkillTagsEditorModal() {
  const { runBlocking, api, currentUser, setCurrentUser } = useContext(AppInstance)
  const [isActive, setIsActive] = useState(false)
  const popularSkills = AsyncStateFetch<ISkill[]>(() => api.skills.popular())
  const [text, setText] = useState('')

  function addOrRemove(skill: ISkill) {
    runBlocking(async () => {
      const hasSkill = !!currentUser?.skills?.find((s) => s._id === skill._id)
      if (hasSkill) {
        const res = await api.skills.remove(skill)
        if (res?.success) {
          const newSkills = currentUser!.skills.filter((s) => s._id !== skill._id)
          setCurrentUser({ ...currentUser!, skills: newSkills })
        } else {
          toast.error('Failed to remove skill')
        }
      } else {
        await createNewTag(skill.name)
      }
    })
  }

  function createNew() {
    if (!text) {
      return
    }

    runBlocking(async () => {
      await createNewTag(text)
      setText('')
    })
  }

  async function createNewTag(name: string) {
    const response = await api.skills.add(name)
    if (response?.skill) {
      const newSkills = [...currentUser!.skills, response.skill]
      setCurrentUser({ ...currentUser!, skills: newSkills })
    } else {
      toast.error('failed to create skill')
    }
  }

  return (
   <>
     <SimpleButton
       theme={"PRIMARY"}
       text={'Add Skill'}
       action={() => setIsActive(true)}
       icon={'fa-edit'}
     />

     <ModalBase
       isActive={isActive}
       setIsActive={setIsActive}
       shouldCloseOnEsc={true}
     >
       <ContainerWithHeaderCloseButton close={() => setIsActive(false)} heading={'Skill Tags Editor'}>
         <FlexBox vertical={true}>
           <BaseText
             text={'Select from popular skills'}
             size={18}
           />
           <BaseText
             text={'Click on each to add or remove a skill'}
             size={14}
             color={Colors.LIGHT_GREY_00}
           />
           <VerticalSpacer size={20} />
           <FlexBox wrap={'wrap'} justify={'flex-start'}>
             {popularSkills.data?.map(skill => {
               const isSelected = !!currentUser?.skills?.find((s) => s._id === skill._id)
               return <SkillTagPill
                 onClick={addOrRemove}
                 skill={skill}
                 isSelected={isSelected}
               />
             })}
           </FlexBox>

           <VerticalContentDivider />

           <FlexBox>
             <ProfileInputField
               name={'Create a new skill'}
               onChange={setText}
               value={text}
             />
             <HorizontalSpacer size={20} />
             <SimpleButton theme={"SUCCESS"} text={'Create'} action={createNew} />
           </FlexBox>
         </FlexBox>
       </ContainerWithHeaderCloseButton>
     </ModalBase>
   </>
  )
}