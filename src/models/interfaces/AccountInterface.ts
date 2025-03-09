import Account, { EAccountRole, IAccount } from '../Account.js'
import StripeManager from '../../internal/payments/StripeManager.js'
import File, { EMetaType } from '../File.js'
import { ObjectId, Types } from 'mongoose'
import { toObjectIds } from '../shared/ModelBuilders.js'

interface IArtistVerified {
  information: boolean,
  address: boolean,
  media: boolean,
  payments: boolean,
  verified: boolean,
}

const AccountInterface = {

  activeArtists: async (): Promise<IAccount[]> => {
    return Account
      .find({
        role: EAccountRole.ARTIST,
        email_verified: true,
        stripe_id: { $ne: null },
        profile_pic: { $ne: null },
        deleted_at: null
      })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')
  },

  activeUsers: async (): Promise<IAccount[]> => {
    return Account
      .find({
        role: EAccountRole.USER,
        email_verified: true,
        deleted_at: null,
      })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')
  },

  load: async (ids: ObjectId[]): Promise<IAccount[]> => {
    return Account
      .find({ _id: { $in: ids } })
      .select('-password')
      .populate('skills')
      .populate('profile_pic')
      .populate('ratings')
  },

  hasChargesEnabled: async (artist: IAccount): Promise<boolean> => {
    if (!artist.stripe_id) {
      return false
    }

    const stripe = await StripeManager.getStripeClient()
    const stripeAccount = await stripe.accounts.retrieve(artist.stripe_id)

    return stripeAccount.charges_enabled && stripeAccount.details_submitted
  },

  verifyArtist: async (artist: IAccount): Promise<IArtistVerified> => {
    const storeFrontImages = await File.find({
      owner_id: artist!._id,
      metaType: EMetaType.STOREFRONT
    }).count()

    // requirements
    const information =
      !!artist!.first_name &&
      !!artist!.last_name &&
      !!artist!.phone_number

    const address =
      !!artist!.address?.coordinates?.lat &&
      !!artist!.address?.coordinates?.lng

    const media = storeFrontImages > 2 && !!artist.profile_pic

    const payments = await AccountInterface.hasChargesEnabled(artist!)

    return {
      information,
      address,
      media,
      payments,
      verified: information && media && payments
    }
  },

  blockedAccountIdsFor: (user: IAccount): Types.ObjectId[] => {
    const excludedAccounts = [...user.blocked]

    return toObjectIds(excludedAccounts)
  },

  updateLastPingFor: async (user: IAccount) => {
    await Account.findByIdAndUpdate(user._id, { last_ping_at: new Date() })
  }

}

export default AccountInterface