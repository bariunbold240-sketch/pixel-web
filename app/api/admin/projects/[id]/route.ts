import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function guard() {
  const s = await getSession()
  return s?.role === 'ADMIN'
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Body шаардлагатай' }, { status: 400 })

  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      name:        body.name,
      status:      body.status       ?? 'Идэвхтэй',
      members:     body.members      ?? 0,
      color:       body.color        ?? '#6f63ff',
      image:       body.image        ?? '',
      description: body.description  ?? '',
      stats:       body.stats        ?? [],
    },
  })
  return NextResponse.json(project)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.project.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
