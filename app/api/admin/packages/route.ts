import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function guard() {
  const s = await getSession()
  return s?.role === 'ADMIN'
}

export async function GET() {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const packages = await prisma.package.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(packages)
}

export async function POST(req: NextRequest) {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body?.name) return NextResponse.json({ error: 'name шаардлагатай' }, { status: 400 })

  const count = await prisma.package.count()
  const pkg = await prisma.package.create({
    data: {
      name:     body.name,
      price:    body.price    ?? '',
      featured: body.featured ?? false,
      features: body.features ?? [],
      order:    count,
    },
  })
  return NextResponse.json(pkg, { status: 201 })
}
