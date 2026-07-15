import { getSession } from '@/lib/auth';
import '@/app/admin/admin.css';
import AdminNavigation from './AdminNavigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If there is no session, render the children directly (e.g. login page)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminNavigation session={session}>
      {children}
    </AdminNavigation>
  );
}
