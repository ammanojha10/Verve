import { requireAdminRoute } from '@/lib/adminAuth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side guard: this will redirect non-admins to /dashboard or /
  await requireAdminRoute()

  return (
    <div className="flex min-h-[calc(100vh-86px)] bg-black/95">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  )
}
