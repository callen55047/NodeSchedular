import { IAccount } from '../../models/Account.js'
import Inquiry, { IInquiry } from '../../models/Inquiry.js'
import InquiryManager from '../../internal/InquiryManager.js'
import FileFactory from './FileFactory.js'

const InquiryFactory = {

  createForArtist: async (user: IAccount, artist: IAccount): Promise<IInquiry | null> => {
    const openInquiry = await InquiryManager.userAndArtistHaveOpenInquiry(user._id, artist._id)
    if (openInquiry) {
      return null
    }

    const attachments = await FileFactory.getRandomImages(3)
    const attachmentIds = attachments.map((att) => att._id)

    return new Inquiry({
      user_id: user._id,
      artist_id: artist._id,
      body_location: "left pec",
      size: "medium",
      description: "hey there, i'm looking to get a sentence printed on my left pec",
      working_on_existing_tattoo: false,
      timeline: "1 month",
      budget: "100-200",
      attachments: attachmentIds
    }).save()
  }
}

export default InquiryFactory