import { IFile } from './File'

interface IMessage {
  _id: number,
  thread_id: string,
  sender_id: string,
  body: string,
  is_read: boolean,
  created_at: string,
  updated_at: string,
  attachments: IFile[]
}

function objIsIMessage(obj: any): obj is IMessage {
  return obj.hasOwnProperty("thread_id") && obj.hasOwnProperty("sender_id")
}

export {
  IMessage,
  objIsIMessage
}
