export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { uploadS3Object } from '@/lib/storage.server'
import { auth } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return new Response(null, { status: 403 })
  const searchParams = request.nextUrl.searchParams
  const fileName = searchParams.get('fileName')
  const contentType = searchParams.get('contentType')
  if (!fileName || !contentType) return new Response(null, { status: 500 })
  const signedObject = await uploadS3Object(`${userId}${process.env.RANDOM_SEPERATOR}${fileName}`, contentType)
  return NextResponse.json(signedObject)
}
