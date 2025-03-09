import Inquiry, { EInquiryStatus } from '../models/Inquiry.js'

const InquiryManager = {

  userHasBeenFlaggedByArtist: async (user_id: any, artist_id: any): Promise<boolean> => {
    const existingInquiry = await Inquiry.findOne({
      user_id,
      artist_id,
      decision: EInquiryStatus.FLAGGED
    })
    return existingInquiry !== null
  },

  userAndArtistHaveOpenInquiry: async (user_id: any, artist_id: any): Promise<boolean> => {
    const existingInquiry = await Inquiry.findOne({
      user_id,
      artist_id,
      decision: EInquiryStatus.PENDING
    })
    return existingInquiry !== null
  },

  parseStatus: (str: string): EInquiryStatus => {
    if (str === EInquiryStatus.ACCEPTED) {
      return EInquiryStatus.ACCEPTED
    } else if (str === EInquiryStatus.DENIED) {
      return EInquiryStatus.DENIED
    } else if (str === EInquiryStatus.FLAGGED) {
      return EInquiryStatus.FLAGGED
    } else if (str === EInquiryStatus.CANCELLED) {
      return EInquiryStatus.CANCELLED
    } else {
      return EInquiryStatus.PENDING
    }
  }
}

export default InquiryManager