import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Public — Баг section reads the featured videos from here
export async function GET() {
  const videos = await prisma.video.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(videos)
}
