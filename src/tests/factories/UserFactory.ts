import Account, { IAccount } from '../../models/Account.js'

const UserFactory = {

  getOrCreateByUsername: async (username: string): Promise<IAccount> => {
    const existing = await Account.findOne({ username })
    if (existing) {
      return existing
    } else {
      return new Account({
        username,
        email: `${username}@domain.com`,
        password: '12345',
        first_name: username,
        last_name: "Appleseed",
        phone_number: "123-456-7890"
      }).save()
      // TODO: can create extra fields for testing
    }
  },

  getArtistByEmail: async (email: string): Promise<IAccount> => {
    const artist = await Account.findOne({ email })
    return artist!
  }
}

export default UserFactory