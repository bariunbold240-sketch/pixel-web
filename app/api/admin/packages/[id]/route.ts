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

  const pkg = await prisma.package.update({
    where: { id: Number(id) },
    data: {
      name:     body.name,
      price:    body.price    ?? '',
      featured: body.featured ?? false,
      features: body.features ?? [],
    },
  })
  return NextResponse.json(pkg)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.package.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
