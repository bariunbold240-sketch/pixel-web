import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return false
  return true
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(photos)
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.src) return NextResponse.json({ error: 'src шаардлагатай' }, { status: 400 })

  const count = await prisma.galleryPhoto.count()
  const photo = await prisma.galleryPhoto.create({
    data: { src: body.src, alt: body.alt ?? '', order: count },
  })
  return NextResponse.json(photo, { status: 201 })
}
