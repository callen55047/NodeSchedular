import { IAccount } from '../models/Account.js'
import File, { EMetaType } from '../models/File.js'
import Logger from './Logger.js'
import AwsController from './controllers/AwsController.js'
import Account from '../models/Account.js'

const AccountManager = (manager?: IAccount) => {
  return {

    archive: async (user: IAccount, message: string) => {
      const archiver = manager?._id ?? user._id
      Logger().info(`Archiving account, initiated by ${archiver}, because: ${message}`)

      const imagesToRemove = await File.find({
        owner_id: user._id,
        $or: [
          { metaType: EMetaType.STOREFRONT },
          { metaType: EMetaType.PROFILE }
        ]
      })

      for (const file of imagesToRemove) {
        await AwsController.deleteFile(file)
        await File.findByIdAndDelete(file._id)
      }

      const updated_at = new Date()
      await Account.findByIdAndUpdate(user._id, {
        updated_at,
        deleted_at: updated_at,
        profile_pic: null,
        stripe_id: null
      })
    }

  }
}

export default AccountManager