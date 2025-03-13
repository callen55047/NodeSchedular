import { EInquiryStatus, EInquiryTimeline, IInquiry } from '../models/Inquiry'
import { IAccount } from '../models/Account'
import { Dictionary, groupBy, sortBy } from 'lodash'

const InquiryTimelineOrder: EInquiryTimeline[] = [
  EInquiryTimeline.ASAP,
  EInquiryTimeline.WITHIN_6_MONTHS,
  EInquiryTimeline.WITHIN_3_MONTHS,
  EInquiryTimeline.THIS_MONTH,
  EInquiryTimeline.UNDECIDED
]

type TOwningContactProps = {
  inquiry: IInquiry,
  contacts: IAccount[]
}

const InquiryStructure = {

  archivedStatuses: [
    EInquiryStatus.CANCELLED,
    EInquiryStatus.DENIED,
    EInquiryStatus.ACCEPTED,
    EInquiryStatus.FLAGGED
  ],

  owningContact: (props: TOwningContactProps): IAccount => {
    const { inquiry, contacts } = props
    return contacts.find((c) => c._id === inquiry.user_id)!
  },

  isArchived: (inquiry: IInquiry): boolean => {
    return inquiry.status !== EInquiryStatus.PENDING
  },

  buildActiveInquiries: (inquiries: IInquiry[]): IInquiry[] => {
    return inquiries.filter((i) => !InquiryStructure.isArchived(i))
  },

  allForContact: (inquiries: IInquiry[], contact: IAccount): IInquiry[] => {
    return inquiries.filter((i) => i.user_id === contact._id)
  },

  groupByTimeline: (sessions: IInquiry[]): Dictionary<IInquiry[]> => {
    const sortedByTimeline = sessions.sort((a, b) => {
      return InquiryTimelineOrder.indexOf(b.timeline) - InquiryTimelineOrder.indexOf(a.timeline)
    })
    return groupBy(sortedByTimeline, (s) => s.timeline)
  },

}

export default InquiryStructure