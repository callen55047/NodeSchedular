import express from 'express'
import multer from 'multer'
import File, { EMetaType } from '../../models/File.js'
import { getUserFromRequest } from '../shared/RequestContext.js'
import { FileManager } from '../../internal/FileManager.js'
import AwsController from '../../internal/controllers/AwsController.js'
import Logger from '../../internal/Logger.js'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

/**
 * Currently only supports image file types.
 * can expand later if needed
 */
router.post('/upload/single', upload.single('file'), async (req, res) => {
  try {
    const file = req.file!
    const { type } = req.body

    if (!FileManager.isValidImageFile(file, type)) {
      return res.status(400).json({ error: 'Invalid file provided'})
    }

    const user = getUserFromRequest(req)
    const savedFile = await FileManager.createWithType(file, type, user)

    return res.status(200).json({ file: savedFile })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while uploading file' })
  }
})

router.post('/upload/many', upload.any(), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[])
    if (!req.files) {
      return res.status(400).send({ error: 'No files were uploaded.' })
    }

    const { type } = req.body
    const user = getUserFromRequest(req)
    const newFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!FileManager.isValidImageFile(file, type)) {
        return res.status(400).json({ error: 'Invalid file provided'})
      }

      const newFile = await FileManager.createWithType(file, type, user)
      newFiles.push(newFile)
    }

    return res.status(200).json({ files: newFiles })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while uploading one or more files' })
  }
})

/**
 * returns list of base64 image strings for simplicity
 * assign url property to image source
 */
router.get('/user/all', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const files = await File.find({ owner_id: user._id })

    return res.status(200).json({ files })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while getting all file' })
  }
})

/**
 * returns list of files that are not an attachment metaType
 * i.e. Inquiry, Message, ProfileInformation, etc.
 */
router.get('/user/non-attachments', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const files = await File.find({
      owner_id: user._id,
      metaType: { $nin: [EMetaType.INQUIRY, EMetaType.MESSAGE, EMetaType.PROFILE] }
    })

    return res.status(200).json({ files })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while getting all file' })
  }
})

/**
 * returns single  s3 object
 */
router.get('/image/:file_id', async (req, res) => {
  try {
    const file_id = req.params.file_id
    const loadedFile = await File.findById(file_id)

    if (!loadedFile) {
      return res.status(404).json({ error: 'file not found' })
    }
    const file = AwsController.getFile(loadedFile)
    res.setHeader('Content-Type', 'image/jpeg')
    return res.status(200).json(file)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while getting file by id' })
  }
})

router.patch('/update/:file_id', async (req, res) => {
  try {
    const file_id = req.params.file_id
    const { metadata } = req.body

    await File.findByIdAndUpdate(file_id, { metadata })

    return res.status(200).json({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while getting file by id' })
  }
})

router.delete('/delete/:file_id', async (req, res) => {
  try {
    const file_id = req.params.file_id
    const file = await File.findById(file_id)

    if (file) {
      await AwsController.deleteFile(file)
      await File.findByIdAndDelete(file._id)
    } else {
      return res.status(404).json({ error: "file not found" })
    }

    return res.status(200).json({ success: true, file_id: file._id })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'error while deleting file' })
  }
})

export default router