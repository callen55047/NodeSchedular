import { IFile, LOCAL_FILE_ID } from '../internal/models/File'
import DataSizing from '../internal/DataSizing'
import ApiController from '../controllers/ApiController'

export default class ImageEditor {
  private fileName = 'ImageEditor_product.jpeg'
  private contentType = 'image/jpeg'
  private nativeFile: File | null = null
  private canvas = document.createElement('canvas')
  private ctx = this.canvas.getContext('2d')!

  withNativeFile(image: File): ImageEditor {
    this.nativeFile = image

    return this
  }

  async withIFile(fileInterface: IFile, api: ApiController): Promise<void> {
    if (fileInterface.local_file) {
      this.withNativeFile(fileInterface.local_file)
      return
    }

    if (fileInterface.name) {
      this.fileName = fileInterface.name
    }

    // TODO: fix downloading image from server
    throw 'Cannot edit remote image'
    // const arrayBuffer = await api.getFileArrayBufferById(fileInterface._id)
    // const blob = new Blob([arrayBuffer])
    // this.nativeFile = new File([blob], this.fileName)
  }

  async toLocalFile(): Promise<IFile> {
    await this.applyScalingIfNeeded()
    const fileUrl = await this.getNativeFileUrl()
    return {
      _id: LOCAL_FILE_ID,
      url: fileUrl,
      local_file: this.nativeFile,
      size: this.nativeFile!.size
    } as IFile
  }

  async rotate(amount: number): Promise<void> {
    const fileUrl = await this.getNativeFileUrl()
    const image = await this.createImageWithUrl(fileUrl)
    this.drawToCanvas(image)

    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
    this.ctx.rotate(amount * Math.PI / 180)
    this.ctx.drawImage(image, -image.width / 2, -image.height / 2)

    this.nativeFile = await this.getFileFromCanvas()
  }

  private async applyScalingIfNeeded() {
    if (this.nativeFile!.size < DataSizing.megabytes(5)) {
      return
    }

    const scale = 0.5
    const fileUrl = await this.getNativeFileUrl()
    const image = await this.createImageWithUrl(fileUrl)
    const width = image.width * scale
    const height = image.height * scale

    this.canvas.width = width
    this.canvas.height = height
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(image, 0, 0, width, height)

    this.nativeFile = await this.getFileFromCanvas()
  }

  async getNativeFileUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('File reader result was unknown type'))
        }
      }

      reader.readAsDataURL(this.nativeFile!)
    })
  }

  private getFileFromCanvas(): Promise<File> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], this.fileName, { type: this.contentType })
          resolve(file)
        } else {
          reject(new Error('Failed to create Blob from canvas'))
        }
      }, this.contentType)
    })
  }

  private drawToCanvas(image: HTMLImageElement) {
    this.canvas.width = image.width
    this.canvas.height = image.height
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)
  }

  private async createImageWithUrl(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      image.src = url
    })
  }
}