import AdminSidebar from '@/app/components/admin/AdminSidebar'
import AdminMobileNav from '@/app/components/admin/AdminMobileNav'
import AdminScrollUnlock from '@/app/components/admin/AdminScrollUnlock'

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminScrollUnlock />
      <div className="flex min-h-screen flex-col lg:flex-row" style={{ background: '#05050d' }}>
        {/* Mobile top nav */}
        <AdminMobileNav />

        {/* Desktop sidebar — sticky so it stays visible while content scrolls */}
        <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
          <AdminSidebar />
        </div>

        {/* Page content — grows and scrolls naturally */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </>
  )
}
