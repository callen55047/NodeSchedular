import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { Environment } from '../EnvironmentConfig.js'
import { IFile } from '../../models/File.js'

const S3_REGION = 'region'
const S3_BUCKET = 'bucket-name'
const S3_FULL_LOCATION = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`

const AwsController = {

  _client: new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: Environment.AWS_ACCESS_KEY!,
      secretAccessKey: Environment.AWS_SECRET_KEY!
    }
  }),

  _getFileKey: (file: IFile): string => {
    return `${file.owner_id}/${file.name}`
  },

  uploadFileAndGetUrl: async (data: Buffer, contentType: string, key: string): Promise<string> => {
    const client = AwsController._client
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: contentType,
      Body: data,
      ACL: 'public-read'
    })

    await client.send(putCommand)

    return `${S3_FULL_LOCATION}/${key}`
  },

  getFile: async (file: IFile): Promise<any> => {
    const client = AwsController._client
    const key = AwsController._getFileKey(file)
    const getCommand = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key
    })

    const s3File = await client.send(getCommand)

    return s3File.Body
  },

  deleteFile: async (file: IFile) => {
    const client = AwsController._client
    const key = AwsController._getFileKey(file)
    const deleteCommand = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key
    })

    await client.send(deleteCommand)
  }
}

export default AwsController