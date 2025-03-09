import Thread, { IThread } from '../models/Thread.js'
import Account, { IAccount } from '../models/Account.js'
import { IMessage } from '../models/Message.js'

interface IThreadAccountProps {
  artist: IAccount,
  user: IAccount
}

const ThreadManager = {

  getExistingOrCreateNew: async (props: IThreadAccountProps): Promise<IThread> => {
    const { artist, user } = props
    const existingThread = await Thread.findOne({ artist_id: artist._id, user_id: user._id })
    if (existingThread) {
      if (existingThread.archived_at) {
        // TODO: handle what we do with continuing after archiving a thread
        const unArchivedThread = await Thread.findByIdAndUpdate(
          existingThread._id,
          { archived_at: null, updated_at: new Date() },
          { new: true }
        )
        return unArchivedThread!
      }
      return existingThread
    } else {
      return new Thread({ artist_id: artist._id, user_id: user._id }).save()
    }
  },

  getActiveThreadOrNull: async (props: IThreadAccountProps): Promise<IThread | null> => {
    const { artist, user } = props
    return Thread.findOne({
      artist_id: artist._id,
      user_id: user._id,
      archived_at: null
    })
  },

  getMessageReceiver: async (message: IMessage, user: IAccount): Promise<IAccount> => {
    const thread = await Thread.findById(message.thread_id)
    const receiverId = thread!.artist_id === user._id ? thread!.artist_id : thread!.user_id
    const account = await Account.findById(receiverId)
    return account!
  }
}

export default ThreadManager