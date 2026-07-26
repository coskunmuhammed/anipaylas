'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Menu, X, Sparkles, PhoneCall } from 'lucide-react';

export default function PalmHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Hizmetler', href: '/hizmetler' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Paketler', href: '/paketler' },
    { label: 'Dijital Anı Albümü', href: '/hizmetler/dijital-ani-albumu' },
    { label: 'İletişim', href: '/iletisim' },
  ];

  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(248, 246, 241, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(24, 61, 53, 0.08)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#183D35',
              color: '#F8F6F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              fontFamily: 'var(--font-serif)',
            }}
          >
            P
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#183D35',
                letterSpacing: '0.04em',
                display: 'block',
                lineHeight: 1,
              }}
            >
              PALM STÜDYO
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#557A67',
                fontWeight: 600,
              }}
            >
              Etkinlik & Tasarım
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#183D35' : '#4a5568',
                  position: 'relative',
                  padding: '4px 0',
                  transition: 'color 0.2s ease',
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: '#B59A63',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="palm-btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} />
            <span>Teklif Al</span>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#183D35',
              cursor: 'pointer',
              padding: '8px',
            }}
            className="mobile-hamburger"
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#F8F6F1',
            borderBottom: '1px solid rgba(24, 61, 53, 0.15)',
            padding: '20px 24px 30px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: pathname === link.href ? '#183D35' : '#4a5568',
                padding: '8px 0',
                borderBottom: '1px solid rgba(24, 61, 53, 0.06)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="palm-btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            <PhoneCall size={18} />
            <span>Teklif İste (WhatsApp)</span>
          </a>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
