'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

interface AdminNavigationProps {
  session: {
    name: string;
    email: string;
  };
  children: React.ReactNode;
}

export default function AdminNavigation({ session, children }: AdminNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const initials = session.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const navItems = [
    { href: '/admin', label: 'Genel Bakış', icon: LayoutDashboard },
    { href: '/admin/events', label: 'Etkinlikler', icon: Calendar },
    { href: '/admin/events/new', label: 'Yeni Etkinlik', icon: Settings },
    { href: '/admin/photos', label: 'Fotoğraflar', icon: ImageIcon },
    { href: '/admin/qr', label: 'QR Kodlar', icon: QrCode },
    { href: '/admin/delivery', label: 'Albüm Hazırlama', icon: PackageOpen },
    { href: '/admin/downloads', label: 'İndirme Bağlantıları', icon: Link2 },
    { href: '/admin/archive', label: 'Arşiv', icon: Archive },
    { href: '/admin/storage', label: 'Depolama', icon: Database },
    { href: '/admin/logs', label: 'Audit Log', icon: ScrollText },
  ];

  return (
    <div className="admin-container">
      {/* Mobile Top Header Bar */}
      <div className="mobile-header">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü Aç"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="sidebar-logo" style={{ marginBottom: 0 }}>
          <span>✨ AnıPaylaş</span>
        </div>

        <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
          {initials}
        </div>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Fixed & Mobile Slide-Over Drawer) */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <span>✨ AnıPaylaş Admin</span>
          <button 
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info mb-20" style={{ padding: '0 8px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{session.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{session.email}</div>
          </div>

          <form action={handleLogout}>
            <button type="submit" className="logout-button">
              <LogOut size={18} />
              <span>Çıkış Yap</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header desktop-only-header">
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
