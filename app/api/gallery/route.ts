import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(photos)
}
