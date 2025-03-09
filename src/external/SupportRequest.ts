import { IAccount } from '../models/Account'
import axios from 'axios'
import { ZenDeskConfig } from '../internal/EnvironmentConfig.js'

enum ETicketPriority {
  NORMAL = 'normal',
}

async function _createZendeskTicket(
  user: IAccount,
  subject: string,
  message: string,
  priority: ETicketPriority
): Promise<void> {

  const ticket = {
    subject: `${user.role} - ${subject}`,
    comment: { body: message },
    requester: {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email
    },
    priority: priority
  }

  await axios.post(ZenDeskConfig.url, { ticket },
    {
      headers: {
        'Authorization': `Basic ${ZenDeskConfig.authEncoded}`,
        'Content-Type': 'application/json'
      }
    }
  )
}

const SupportRequest = {
  to: (user: IAccount) => {

    return {

      normal: async (subject: string, message: string): Promise<void> => {
        return _createZendeskTicket(user, subject, message, ETicketPriority.NORMAL)
      }

    }
  }
}

export default SupportRequest