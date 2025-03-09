import express from 'express'
import Account, { EAccountRole } from '../../models/Account.js'
import Skill from '../../models/Skill.js'
import File from '../../models/File.js'
import { EMetaType } from '../../models/File.js'
import { getUserFromRequest } from '../shared/RequestContext.js'
import Logger from '../../internal/Logger.js'
import MRegx from '../../internal/input/MRegx.js'
import GeoLocation from '../../internal/GeoLocation.js'
import { ICoordinate } from '../../models/shared/Address.js'
import AccountInterface from '../../models/interfaces/AccountInterface.js'

const router = express.Router()

router.get('/search', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const { query, lat, lng, page, limit } = req.body
    const userCoords = { lat, lng } as ICoordinate
    const validCoords = !!userCoords.lat && !!userCoords.lng
    const pageNumber = page || 1
    const limitNumber = limit || 12
    const skipNumber = (pageNumber - 1) * limitNumber

    const queryParams: any = {
      role: EAccountRole.ARTIST,
      email_verified: true,
      stripe_id: { $ne: null },
      profile_pic: { $ne: null },
      address: { $ne: null },
      deleted_at: null,
      _id: { $nin: AccountInterface.blockedAccountIdsFor(user) }
    }

    if (query) {
      const regex = MRegx.caseSensitive(query)
      const skillTags = await Skill.find({ name: { $regex: regex } })
      const skillIds = skillTags.map((skill) => skill._id)

      queryParams['$or'] = [
        { first_name: regex },
        { last_name: regex },
        { username: regex },
        { skills: { $in: skillIds } }
      ]
    }

    const accountIdRefs = await Account.aggregate([
      { $match: queryParams },
      // make sure artists have storefront images
      {
        $lookup: {
          from: 'files',
          let: { accountId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$owner_id', '$$accountId'] },
                    { $eq: ['$metaType', EMetaType.STOREFRONT] }
                  ]
                }
              }
            }
          ],
          as: 'images'
        }
      },
      {
        $match: {
          $expr: { $gte: [{ $size: '$images' }, 3] }
        }
      },
      // calculate distance if userCoordinates are provided
      ...(validCoords ? [{
        $addFields: {
          distance: {
            $sqrt: {
              $add: [
                { $pow: [{ $subtract: ['$address.coordinates.lat', userCoords.lat] }, 2] },
                { $pow: [{ $subtract: ['$address.coordinates.lng', userCoords.lng] }, 2] }
              ]
            }
          }
        }
      }] : []),
      { $addFields: { distance: { $ifNull: ['$distance', Infinity] } } },
      { $sort: { distance: 1 } },
      { $skip: skipNumber },
      { $limit: limitNumber },
      { $project: { _id: 1 } } // map final output to array of ids
    ])

    // fetch account and populate with data
    const accounts = await Account
      .find({ _id: { $in: accountIdRefs } })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')

    // final sort by distance
    accounts.sort((a, b) => {
      if (!a.address || !b.address) {
        return -1
      }
      return (GeoLocation(userCoords).distanceTo(a.address?.coordinates) ?? 0) -
        (GeoLocation(userCoords).distanceTo(b.address?.coordinates) ?? 0)
    })

    const accountIds = accounts.map((a) => a._id)
    const images = await File.find({ owner_id: { $in: accountIds }, metaType: EMetaType.STOREFRONT })

    return res.status(200).json({ accounts, images })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'Error while searching profiles' })
  }
})

export default router
