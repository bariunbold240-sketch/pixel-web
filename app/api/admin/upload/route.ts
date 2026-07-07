import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const s = await getSession()
  if (s?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'file шаардлагатай' }, { status: 400 })

  // Vercel's runtime filesystem is read-only/ephemeral, so uploads must go to
  // persistent object storage (Vercel Blob) instead of public/uploads on disk.
  // put() reads BLOB_READ_WRITE_TOKEN from the environment automatically.
  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const blob = await put(`uploads/${Date.now()}.${ext}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url })
}
