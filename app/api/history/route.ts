export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import redis from '@/lib/redis.server'
import { auth } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return new Response(null, { status: 403 })
  const count = 10
  const audioNames = []
  const searchParams = request.nextUrl.searchParams
  const start = parseInt(searchParams.get('start') ?? '0')
  const [_, items] = await redis.hscan(userId, start, { count })
  for (let i = 0; i < items.length; i += 2) audioNames.push({ key: items[i], value: items[i + 1] })
  return NextResponse.json(audioNames)
}
