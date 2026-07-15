import { getSession } from '@/lib/auth';
import Link from 'next/link';
import '@/app/admin/admin.css';
import { handleLogout } from './actions';
import { 
  LayoutDashboard, 
  Calendar, 
  Image as ImageIcon, 
  QrCode, 
  PackageOpen, 
  Link2, 
  Archive, 
  Database, 
  Settings, 
  ScrollText, 
  LogOut 
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If there is no session, render the children directly (e.g. the login page)
  if (!session) {
    return <>{children}</>;
  }

  // Helper to extract initials
  const initials = session.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span>✨ AnıPaylaş Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          <Link href="/admin" className="nav-link">
            <LayoutDashboard size={18} />
            <span>Genel Bakış</span>
          </Link>
          <Link href="/admin/events" className="nav-link">
            <Calendar size={18} />
            <span>Etkinlikler</span>
          </Link>
          <Link href="/admin/events/new" className="nav-link">
            <Settings size={18} />
            <span>Yeni Etkinlik</span>
          </Link>
          <Link href="/admin/photos" className="nav-link">
            <ImageIcon size={18} />
            <span>Fotoğraflar</span>
          </Link>
          <Link href="/admin/qr" className="nav-link">
            <QrCode size={18} />
            <span>QR Kodlar</span>
          </Link>
          <Link href="/admin/delivery" className="nav-link">
            <PackageOpen size={18} />
            <span>Albüm Hazırlama</span>
          </Link>
          <Link href="/admin/downloads" className="nav-link">
            <Link2 size={18} />
            <span>İndirme Bağlantıları</span>
          </Link>
          <Link href="/admin/archive" className="nav-link">
            <Archive size={18} />
            <span>Arşiv</span>
          </Link>
          <Link href="/admin/storage" className="nav-link">
            <Database size={18} />
            <span>Depolama</span>
          </Link>
          <Link href="/admin/logs" className="nav-link">
            <ScrollText size={18} />
            <span>Audit Log</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <form action={handleLogout}>
            <button type="submit" className="logout-button">
              <LogOut size={18} />
              <span>Çıkış Yap</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            <span>Kontrol Paneli</span>
          </div>
          
          <div className="admin-user-profile">
            <div className="avatar">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{session.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{session.email}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
