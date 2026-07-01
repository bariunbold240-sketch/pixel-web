import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  return session?.role === 'ADMIN'
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const icons = await prisma.techIcon.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(icons)
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.src || !body?.label) return NextResponse.json({ error: 'src, label шаардлагатай' }, { status: 400 })

  const count = await prisma.techIcon.count()
  const icon  = await prisma.techIcon.create({
    data: { src: body.src, label: body.label, order: count },
  })
  return NextResponse.json(icon, { status: 201 })
}
