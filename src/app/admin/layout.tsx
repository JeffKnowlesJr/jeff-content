// Mark all admin routes as dynamic to prevent static generation
export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
