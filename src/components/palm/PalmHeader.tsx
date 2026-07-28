'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, Lock } from 'lucide-react';

export default function PalmHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'HİKÂYELER', href: '/hikayeler' },
    { label: 'HİZMETLER', href: '/hizmetler' },
    { label: 'FOTOĞRAFLAR', href: '/galeri' },
    { label: 'KONSEPTLER', href: '/konseptler' },
    { label: 'HAKKIMIZDA', href: '/hakkimizda' },
    { label: 'DİJİTAL ANI ALBÜMÜ', href: '/hizmetler/dijital-ani-albumu' },
    { label: 'İLETİŞİM', href: '/iletisim' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(13, 11, 9, 0.96)' : 'rgba(13, 11, 9, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Brand Logo */}
        <Link 
          href="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            marginRight: '12px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.3rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              color: '#ffffff',
            }}
          >
            PALM
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.3rem',
              fontWeight: 300,
              letterSpacing: '0.12em',
              color: '#ffffff',
              position: 'relative',
              paddingRight: '12px',
            }}
          >
            STUDIO
            <span
              style={{
                fontSize: '0.55rem',
                position: 'absolute',
                top: '0px',
                right: '0px',
                color: 'var(--palm-gold)',
                fontWeight: 700,
              }}
            >
              ®
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'nowrap',
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
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: isActive ? 'var(--palm-gold-light)' : 'rgba(255, 255, 255, 0.9)',
                  position: 'relative',
                  padding: '4px 0',
                  whiteSpace: 'nowrap',
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
                      backgroundColor: 'var(--palm-gold)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link
            href="/admin"
            className="palm-btn-secondary desktop-cta"
            title="Etkinlik Yönetimi & Admin Girişi"
            style={{
              padding: '8px 14px',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--palm-gold-light)',
              borderColor: 'rgba(201, 170, 103, 0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            <Lock size={13} style={{ color: 'var(--palm-gold)' }} />
            <span>ADMİN GİRİŞİ</span>
          </Link>

          <Link
            href="/rezervasyon"
            className="palm-btn-gold desktop-cta"
            style={{
              padding: '8px 18px',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              color: '#0d0b09',
              fontWeight: 800,
            }}
          >
            <Calendar size={13} />
            <span>TARİH SEÇ - FİYAT AL</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px',
            }}
            className="mobile-hamburger"
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#17120e',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '24px 32px 36px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: pathname === link.href ? 'var(--palm-gold)' : 'rgba(255, 255, 255, 0.95)',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="palm-btn-secondary"
            style={{ width: '100%', marginTop: '8px', textAlign: 'center', borderColor: 'var(--palm-gold)', color: 'var(--palm-gold-light)' }}
          >
            <Lock size={16} style={{ color: 'var(--palm-gold)' }} />
            <span>ADMİN / ETKİNLİK YÖNETİMİ GİRİŞİ</span>
          </Link>

          <Link
            href="/rezervasyon"
            onClick={() => setMobileMenuOpen(false)}
            className="palm-btn-gold"
            style={{ width: '100%', textAlign: 'center', color: '#0d0b09', fontWeight: 800 }}
          >
            <Calendar size={16} />
            <span>TARİH SEÇ - FİYAT AL</span>
          </Link>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 1260px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-cta {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
