export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import redis from '@/lib/redis.server'
import { getS3Object } from '@/lib/storage.server'
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs'
import FormData from 'form-data'
import fetch from 'node-fetch'

export const POST = verifySignatureAppRouter(handler)

async function handler(request: Request) {
  const { fileName } = await request.json()
  const url = await getS3Object(fileName)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch audio file: ${response.statusText}.`)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const form = new FormData()
  form.append('file', buffer)
  form.append('language', 'en')
  const options = {
    body: form,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
    },
  }
  const transcribeCall = await fetch('https://api.fireworks.ai/inference/v1/audio/transcriptions', options)
  const transcribeResp: any = await transcribeCall.json()
  if (transcribeResp?.['text']) {
    await redis.hset(fileName.split(process.env.RANDOM_SEPERATOR)[0], {
      [fileName.split(process.env.RANDOM_SEPERATOR)[1]]: {
        transcribed: true,
        transcription: transcribeResp.text,
      },
    })
  }
  return new Response()
}
