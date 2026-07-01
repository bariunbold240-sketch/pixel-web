import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const s = await getSession()
  if (s?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'file шаардлагатай' }, { status: 400 })

  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const name = `${Date.now()}.${ext}`
  const dir  = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ url: `/uploads/${name}` })
}
