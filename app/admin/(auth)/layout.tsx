import type { Metadata } from 'next'

// Admin login — never indexed.
export const metadata: Metadata = {
  title: 'Админ нэвтрэх',
  robots: { index: false, follow: false },
}

// Centered wrapper for the login page — no sidebar
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#05050d' }}
    >
      <div className="absolute pointer-events-none rounded-full"
        style={{ width: 700, height: 700, top: '-20%', left: '-15%',
          background: 'radial-gradient(circle, rgba(111,99,255,0.1) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      <div className="absolute pointer-events-none rounded-full"
        style={{ width: 500, height: 500, bottom: '-15%', right: '-10%',
          background: 'radial-gradient(circle, rgba(255,79,216,0.09) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 w-full max-w-[420px] px-4 py-10">
        {children}
      </div>
    </div>
  )
}
