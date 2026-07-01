import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Derive IP for rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Хэт олон оролдлого. 15 минутын дараа дахин оролдоно уу.' },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => null)
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'И-мэйл болон нууц үг шаардлагатай.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: String(body.email) } })

  // Compare even when user is null to avoid timing attacks
  const dummyHash = '$2b$12$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  const valid = user
    ? await bcrypt.compare(String(body.password), user.password)
    : await bcrypt.compare(String(body.password), dummyHash).then(() => false)

  if (!user || !valid) {
    return NextResponse.json({ error: 'И-мэйл эсвэл нууц үг буруу байна.' }, { status: 401 })
  }

  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Хандах эрхгүй байна.' }, { status: 403 })
  }

  resetRateLimit(ip)
  await createSession({ userId: user.id, role: user.role })

  return NextResponse.json({ ok: true })
}
