import Account, { EAccountRole, IAccount } from '../../models/Account.js'
import MRegx from '../input/MRegx.js'
import Skill from '../../models/Skill.js'

export default class SSEngine {

  async run(query: string, page: number, limit: number) {
    const pageNumber = page || 1
    const limitNumber = limit || 12

    const queryParams: any = {
      role: EAccountRole.ARTIST,
      email_verified: true,
      stripe_id: { $ne: null },
      profile_pic: { $ne: null },
      deleted_at: null
    }

    if (query) {
      const regex = MRegx.caseSensitive(query)
      const skillTags = await Skill.find({ name: { $regex: regex } })
      const skillIds = skillTags.map((skill) => skill._id)

      queryParams['$or'] = [
        { first_name: regex },
        { last_name: regex },
        { username: regex },
        { skills: { $in: skillIds }}
      ]
    }

    const accounts = await Account.aggregate([
      // basic search
      { $match: queryParams },

      // lookup images attached to each account
      {
        $lookup: {
          from: 'File',
          localField: '_id',
          foreignField: 'owner_id',
          as: 'storefrontImages'
        }
      },
      // filter out accounts without images
      {
        $match: {
          'storefrontImages.0': { $exists: true }
        }
      },
      // paginate
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      // exclude fields
      { $project: { password: 0 } },
      // populate fields
      {
        $lookup: {
          from: 'Skill',
          localField: 'skills',
          foreignField: '_id',
          as: 'skills'
        }
      },
      {
        $lookup: {
          from: 'File',
          localField: 'profile_pic',
          foreignField: '_id',
          as: 'profile_pic'
        }
      },
      {
        $lookup: {
          from: 'Rating',
          localField: 'ratings',
          foreignField: '_id',
          as: 'ratings'
        }
      }
    ]) as IAccount[]
    console.log(accounts)
  }
}