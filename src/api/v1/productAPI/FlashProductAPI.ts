import express from 'express'
import Logger from '../../../internal/Logger.js'
import { getUserFromRequest } from '../../shared/RequestContext.js'
import FlashProduct from '../../../models/products/FlashProduct.js'
import AwsController from '../../../internal/controllers/AwsController.js'
import File from '../../../models/File.js'

const router = express.Router()

router.get('/all', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const products = await FlashProduct
      .find({ artist_id: user._id })
      .populate('image')

    return res.status(200).send(products)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'unable to get all flash products' })
  }
})

router.post('/create', async (req, res) => {
  try {
    const user = getUserFromRequest(req)
    const {
      title,
      description,
      quantity,
      price,
      width,
      height,
      start_date,
      end_date,
      image_id
    } = req.body

    const product = await new FlashProduct({
      artist_id: user._id,
      title,
      description,
      quantity,
      price,
      width,
      height,
      start_date,
      end_date,
      image: image_id
    }).save()

    return res.status(200).send(product)
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'unable to create new flash product' })
  }
})

router.delete('/delete/:flashProductId', async (req, res) => {
  try {
    const fp = await FlashProduct.findById(req.params.flashProductId)
    const file = await File.findById(fp!.image)

    await AwsController.deleteFile(file!)
    await File.findByIdAndDelete(file!._id)
    await FlashProduct.findByIdAndDelete(fp!._id)

    return res.status(200).send({ success: true })
  } catch (error) {
    Logger(req).exception(error)
    return res.status(500).json({ exception: 'unable to delete new flash product' })
  }
})

export default router