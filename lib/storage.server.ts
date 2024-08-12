import { GetObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const accessKeyId = process.env.AWS_KEY_ID
const region = process.env.AWS_REGION_NAME
const s3BucketName = process.env.AWS_S3_BUCKET_NAME
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const r2AccountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID

let client: S3Client

function getS3Client() {
  if (!accessKeyId || !secretAccessKey) throw new Error(`Access key and Secret Access Key environment variables are not defined.`)
  if (client) return
  let s3Config: S3ClientConfig = {
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  }
  if (region) s3Config = { ...s3Config, region }
  if (r2AccountId) s3Config = { ...s3Config, endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com` }
  client = new S3Client(s3Config)
}

export async function getS3Object(Key: string) {
  getS3Client()
  const command = new GetObjectCommand({
    Key,
    Bucket: s3BucketName,
  })
  return await getSignedUrl(client, command, { expiresIn: 3600 })
}

export async function uploadS3Object(Key: string, type: string) {
  getS3Client()
  const command = new PutObjectCommand({
    Key,
    ContentType: type,
    Bucket: s3BucketName,
  })
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 })
  return [signedUrl, Key]
}
