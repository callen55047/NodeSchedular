import File, { IFile } from '../../models/File.js'

const FileFactory = {

  getRandomImages: async (num: number = 1): Promise<IFile[]> => {
    const list = await File.find({}).limit(num)
    return list!
  }
}

export default FileFactory