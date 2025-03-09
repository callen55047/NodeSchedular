import cryptoRandomString from 'crypto-random-string'
import { IAccount } from '../models/Account.js'
import File, { EMetaType, IFile } from '../models/File.js'
import moment from 'moment'
import sharp from 'sharp'
// @ts-ignore
import AwsController from './controllers/AwsController.js'

const IMAGE_FORMATS = ['jpeg', 'png', 'webp', 'heic', 'jpg']

const FileManager = {

  getMetaType: (type: string | undefined): EMetaType => {
    if (!type) {
      return EMetaType.NONE
    }

    if (type === EMetaType.STOREFRONT) {
      return EMetaType.STOREFRONT
    } else if (type === EMetaType.MESSAGE) {
      return EMetaType.MESSAGE
    } else if (type === EMetaType.INQUIRY) {
      return EMetaType.INQUIRY
    } else if (type === EMetaType.PROFILE) {
      return EMetaType.PROFILE
    }
    return EMetaType.NONE
  },

  createWithType: async (
    file: Express.Multer.File,
    type: string,
    user: IAccount
  ): Promise<IFile> => {
    const metaType = FileManager.getMetaType(type)
    const fileName = FileManager.buildFileName(metaType)
    const contentType = 'jpeg'

    const compressedImageBuffer = await sharp(file.buffer)
      .rotate()
      .withMetadata({ orientation: 1 })
      .toFormat(contentType)
      .jpeg({ quality: 50 })
      .toBuffer()

    const fileKey = `${user._id}/${fileName}`
    const fileUrl = await AwsController.uploadFileAndGetUrl(compressedImageBuffer, contentType, fileKey)

    return new File({
      name: fileName,
      owner_id: user._id,
      metaType,
      url: fileUrl,
      size: file.size,
      contentType: 'image/jpeg'
    }).save()
  },

  buildFileName: (metaType: EMetaType): string => {
    const normalizedDate = moment().utc(false).format()
    const randomKey = cryptoRandomString({ length: 16 })

    return `${metaType}_${normalizedDate}_${randomKey}`
  },

  isValidImageFile: (file: Express.Multer.File, type: string | undefined): boolean => {
    const fileFormat = file.originalname.split('.').pop()?.toLowerCase()!

    return IMAGE_FORMATS.includes(fileFormat) && !!type &&
      Object.values(EMetaType).includes(type as EMetaType) &&
      type !== EMetaType.NONE
  }
}

export {
  FileManager
}