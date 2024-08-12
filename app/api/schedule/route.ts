export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import redis from '@/lib/redis.server'
import { Client } from '@upstash/qstash'

if (!process.env.QSTASH_TOKEN) throw new Error(`QSTASH_TOKEN environment variable is not found.`)

const client = new Client({ token: process.env.QSTASH_TOKEN })

export async function POST(request: Request) {
  const { fileName } = await request.json()
  await Promise.all([
    client.publishJSON({
      delay: 10,
      body: { fileName },
      url: `${process.env.DEPLOYMENT_URL}/api/transcribe`,
    }),
    redis.hset(fileName.split(process.env.RANDOM_SEPERATOR)[0], {
      [fileName.split(process.env.RANDOM_SEPERATOR)[1]]: {
        transcribed: false,
      },
    }),
  ])
  return new Response()
}
