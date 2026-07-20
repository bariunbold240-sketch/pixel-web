import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { parseYoutubeId } from '@/lib/youtube'

async function requireAdmin() {
  const session = await getSession()
  return session?.role === 'ADMIN'
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const videos = await prisma.video.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(videos)
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.url || !body?.title) return NextResponse.json({ error: 'url, title шаардлагатай' }, { status: 400 })

  const youtubeId = parseYoutubeId(String(body.url))
  if (!youtubeId) return NextResponse.json({ error: 'YouTube линк буруу байна' }, { status: 400 })

  const count = await prisma.video.count()
  const video = await prisma.video.create({
    data: { youtubeId, title: String(body.title).trim(), order: count },
  })
  return NextResponse.json(video, { status: 201 })
}
