import type { Metadata } from 'next'

// Client page can't export metadata itself — this server layout sets its title.
// robots:noindex is inherited from app/(dashboard)/layout.tsx.
export const metadata: Metadata = {
  title: 'Тохиргоо',
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
