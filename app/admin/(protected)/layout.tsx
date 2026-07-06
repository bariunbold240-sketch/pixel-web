import type { Metadata } from 'next'
import AdminSidebar from '@/app/components/admin/AdminSidebar'
import AdminMobileNav from '@/app/components/admin/AdminMobileNav'
import AdminScrollUnlock from '@/app/components/admin/AdminScrollUnlock'

// Admin CMS — never indexed.
export const metadata: Metadata = {
  // `template` suffixes child pages (packages, projects, gallery, icons) with their own title.
  title: { default: 'Админ', template: '%s | PIXEL' },
  robots: { index: false, follow: false },
}

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminScrollUnlock />
      <div className="flex min-h-dvh flex-col overflow-hidden lg:h-screen lg:flex-row" style={{ background: '#05050d' }}>
        {/* Mobile top nav */}
        <AdminMobileNav />

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Page content */}
        <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
