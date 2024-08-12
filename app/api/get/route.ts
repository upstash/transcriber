export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { getS3Object } from '@/lib/storage.server'
import { auth } from '@clerk/nextjs/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return new Response(null, { status: 403 })
  const searchParams = request.nextUrl.searchParams
  const fileName = searchParams.get('fileName')
  if (!fileName) return new Response(null, { status: 400 })
  if (!fileName.startsWith(userId)) return new Response(null, { status: 403 })
  const signedUrl = await getS3Object(fileName)
  return new Response(signedUrl)
}
