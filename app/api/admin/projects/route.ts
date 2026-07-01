import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function guard() {
  const s = await getSession()
  return s?.role === 'ADMIN'
}

export async function GET() {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body?.name) return NextResponse.json({ error: 'name шаардлагатай' }, { status: 400 })

  const count = await prisma.project.count()
  const project = await prisma.project.create({
    data: {
      name:        body.name,
      status:      body.status       ?? 'Идэвхтэй',
      members:     body.members      ?? 0,
      color:       body.color        ?? '#6f63ff',
      image:       body.image        ?? '',
      description: body.description  ?? '',
      stats:       body.stats        ?? [],
      order:       count,
    },
  })
  return NextResponse.json(project, { status: 201 })
}
