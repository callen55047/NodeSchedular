import AccountInterface from '../../models/interfaces/AccountInterface.js'
import Thread from '../../models/Thread.js'
import Message from '../../models/Message.js'
import Inquiry, { EInquiryStatus } from '../../models/Inquiry.js'
import { EAccountRole } from '../../models/Account.js'
import Logger from '../../internal/Logger.js'
import PushNotification from '../../internal/controllers/PushNotification.js'

export default async function DailySummaryTask() {
  const artists = await AccountInterface.activeArtists()
  const users = await AccountInterface.activeUsers()

  for (const account of [...artists, ...users]) {
    const threads = await Thread.find({
      artist_id: account._id,
      archived_at: null
    })
    const unreadMessages = await Message.find({
      thread_id: { $in: threads },
      sender_id: { $ne: account._id },
      is_read: false
    })

    if (account.role === EAccountRole.ARTIST) {
      const inquiries = await Inquiry.find({
        artist_id: account._id,
        status: EInquiryStatus.PENDING
      })

      if (unreadMessages.length > 0 || inquiries.length > 0) {
        Logger().info(
          `[DailySummaryTask] 
        artist: ${account.username}, 
        inquiries: ${inquiries.length}, 
        messages: ${unreadMessages.length}`
        )

        // send email to artist
        await PushNotification()
          .to(account)
          .summary
          .dailyUnread(inquiries, unreadMessages)
      }
    } else {
      if (unreadMessages.length > 0) {
        Logger().info(
          `[DailySummaryTask] 
        user: ${account.username}, 
        messages: ${unreadMessages.length}`
        )

        // send email to user
        await PushNotification()
          .to(account)
          .summary
          .dailyUnread([], unreadMessages)
      }
    }
  }
}