import APIClass from './APIClass'
import { ApiContract } from '../../contracts/ApiContract'
import { ISkill } from '../../internal/models/Skill'

export default class SkillAPI extends APIClass {
  private url = 'skills'

  async all(): Promise<ISkill[] | null> {
    return this.controller.dataTask<ISkill[]>(
      `${this.url}/all`,
      'get',
    )
  }

  async allReferences(): Promise<ApiContract.Response.SkillRefs | null> {
    return this.controller.dataTask<ApiContract.Response.SkillRefs>(
      `${this.url}/all-references`,
      'get',
    )
  }

  async add(name: string): Promise<ApiContract.Response.SkillAdd | null> {
    return this.controller.dataTask<ApiContract.Response.SkillAdd>(
      `${this.url}/add`,
      'post',
      { name }
    )
  }

  async update(skill: ISkill, name: string): Promise<ApiContract.Response.SkillAdd | null> {
    return this.controller.dataTask<ApiContract.Response.SkillAdd>(
      `${this.url}/update`,
      'patch',
      {
        skill_id: skill._id,
        name
      }
    )
  }

  async remove(skill: ISkill): Promise<ApiContract.Response.Success | null> {
    return this.controller.dataTask<ApiContract.Response.Success>(
      `${this.url}/user/remove/${skill._id}`,
      'delete'
    )
  }

  async popular(): Promise<ISkill[] | null> {
    return this.controller.dataTask<ISkill[]>(
      `${this.url}/most-popular`,
      'get'
    )
  }
}