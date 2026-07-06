import type { Metadata } from 'next'

// Client page can't export metadata itself — this server layout sets its title.
// robots:noindex is inherited from app/(public)/layout.tsx.
export const metadata: Metadata = {
  title: 'Нууц үг сэргээх',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
