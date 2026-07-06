import type { Metadata } from 'next'
import Sidebar from '../components/dashboard/Sidebar'
import MobileDashboardNav from '../components/dashboard/MobileDashboardNav'

// Authenticated client portal — never indexed.
export const metadata: Metadata = {
  // `template` suffixes child pages (projects, settings) that set their own title.
  title: { default: 'Хэрэглэгчийн самбар', template: '%s | PIXEL' },
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-hidden lg:h-screen lg:flex-row" style={{ background: '#05050d' }}>
      <MobileDashboardNav />
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
