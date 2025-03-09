import express from 'express'
import { getUserFromRequest } from '../shared/RequestContext.js'
import Thread from '../../models/Thread.js'
import Message from '../../models/Message.js'
import Logger from '../../internal/Logger.js'
import PushNotification from '../../internal/controllers/PushNotification.js'
import ThreadManager from '../../internal/ThreadManager.js'

const router = express.Router()

/**
 * Artist should be the only ones who can create threads
 */
router.post('/create-thread', async (req, res) => {
  try {
    const artist = getUserFromRequest(req)
    const { user_id } = req.body
    const artist_id = artist._id

    const newThread = await new Thread({ artist_id, user_id }).save()

    return res.status(201).json({ thread_id: newThread._id })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while creating thread' })
  }
})

router.post('/create', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const { thread_id, body, attachments } = req.body

    const newMessage = await new Message({
      thread_id,
      sender_id: user._id,
      body,
      attachments
    }).save()
    await newMessage.populate('attachments')

    const receiver = await ThreadManager.getMessageReceiver(newMessage, user)
    PushNotification()
      .from(user)
      .to(receiver)
      .message.created(newMessage)

    return res.status(201).json(newMessage)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while creating message' })
  }
})

router.patch('/thread/read', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const { thread_id } = req.body

    const updateRes = await Message.updateMany(
      { thread_id, sender_id: { $ne: user._id } },
      { is_read: true, updated_at: new Date() }
    )

    return res.status(200).json({ success: true, count: updateRes.modifiedCount })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while marking thread as read' })
  }
})

/**
 * Artist and user endpoint for retrieving all threads and messages combined
 */
router.get('/all', async (req, res) => {
  try {
    const user = getUserFromRequest(req)

    const threads = await Thread.find({
      $or: [
        { artist_id: user._id },
        { user_id: user._id }
      ],
      archived_at: null
    })
    const messages = await Message.find({ thread_id: { $in: threads } })

    const combinedData = threads.map((thread) => {
      return {
        _id: thread._id,
        artist_id: thread.artist_id,
        user_id: thread.user_id,
        created_at: thread.created_at,
        updated_at: thread.updated_at,
        messages: messages.filter((m) => thread._id.equals(m.thread_id.toString()))
      }
    })

    return res.status(200).json({ threads: combinedData })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while getting all messages' })
  }
})

export default router