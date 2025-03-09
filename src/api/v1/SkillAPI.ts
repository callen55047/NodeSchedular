import express from 'express'
import { getUserFromRequest } from '../shared/RequestContext.js'
import Skill, { ISkill } from '../../models/Skill.js'
import Account from '../../models/Account.js'
import Logger from '../../internal/Logger.js'

const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const { name } = req.body

    const lowerCased = name.toLowerCase().trim()
    let skill = await Skill.findOne({ name: lowerCased })
    if (!skill) {
      skill = await new Skill({ name: lowerCased }).save()
    }

    await Account.findByIdAndUpdate(user._id, { $push: { skills: skill } })

    return res.status(200).json({ skill })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while adding skills' })
  }
})

router.patch('/update', async (req, res) => {
  try {
    const { skill_id, name } = req.body

    const lowerCased = name.toLowerCase().trim()
    await Skill.findByIdAndUpdate(skill_id, { name: lowerCased })

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while adding skills' })
  }
})

router.delete('/user/remove/:skill_id', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const skill_id = req.params.skill_id
    await Account.findByIdAndUpdate(user._id, { $pull: { skills: skill_id } })

    const skill = await Skill.findById(skill_id)
    const activeReferences = await Account.find({ skills: { $in: skill }})
    if (activeReferences.length < 1) {
      await Skill.findByIdAndDelete(skill_id)
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(`${req.url} error: `, error)
    return res.status(500).json({ exception: 'error while removing skills' })
  }
})

router.get('/all', async (req, res) => {
  try {
    const skills = await Skill.find({})
    return res.status(200).json(skills)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error getting all skills' })
  }
})

router.get('/all-references', async (req, res) => {
  try {
    const skills = await Skill.find({})
    const accounts = await Account
      .find({ skills: { $in: skills } })
      .populate('skills')
      .populate('profile_pic')

    return res.status(200).json({ skills, accounts })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error getting all skills' })
  }
})

router.get('/user/all', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const account = await Account.findById(user._id).populate('skills')
    return res.status(200).json({ skills: account?.skills })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error getting all skills' })
  }
})

router.get('/most-popular', async (req, res) => {
  try {
    const skills = await Account.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: '_id',
          as: 'skill'
        }
      },
      { $unwind: '$skill' },
      { $replaceRoot: { newRoot: '$skill' } }
    ]).limit(20) as ISkill[]

    return res.status(200).json(skills)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error getting all skills' })
  }
})

export default router