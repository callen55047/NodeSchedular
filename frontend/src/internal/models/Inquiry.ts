import { IFile } from './File'
import { IInquiryField } from './templates/InquiryTemplate'

interface IInquiry {
  _id: string,
  user_id: string,
  artist_id: string,
  body_location: string,
  size: string,
  description: string,
  working_on_existing_tattoo: boolean,
  timeline: EInquiryTimeline,
  budget: string,
  fields: IInquiryField[]
  flash_id: string | null,
  status: EInquiryStatus,
  artist_notes: string,
  attachments: IFile[],
  created_at: string,
  updated_at: string
}

enum EInquiryStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DENIED = 'denied',
  CANCELLED = 'cancelled',
  FLAGGED = 'flagged'
}

enum EInquiryTimeline {
  ASAP = 'ASAP (1-2 weeks)',
  THIS_MONTH = 'this month',
  WITHIN_3_MONTHS = '1-3 months',
  WITHIN_6_MONTHS = '3 months +',
  UNDECIDED = 'undecided'
}

function objIsIInquiry(obj: any): obj is IInquiry {
  return obj.hasOwnProperty('working_on_existing_tattoo') &&
    obj.hasOwnProperty('timeline')
}

export {
  IInquiry,
  EInquiryStatus,
  objIsIInquiry,
  EInquiryTimeline
}