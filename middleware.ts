import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'px_session'

// Runs on Edge — cannot use Node.js-only modules here (no bcrypt, no prisma)
function secret() {
  const s = process.env.SESSION_SECRET ?? ''
  return new TextEncoder().encode(s)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // /admin/login is always public
  if (pathname === '/admin/login') return NextResponse.next()

  // Protect every other /admin/* route
  const token = req.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  try {
    await jwtVerify(token, secret())
    return NextResponse.next()
  } catch {
    // Token invalid or expired
    const res = NextResponse.redirect(new URL('/admin/login', req.url))
    res.cookies.delete(COOKIE_NAME)
    return res
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
