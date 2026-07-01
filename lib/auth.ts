import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'px_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface SessionPayload extends JWTPayload {
  userId: string
  role: string
}

function secret() {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET environment variable is not set')
  return new TextEncoder().encode(s)
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())

  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret())
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}
