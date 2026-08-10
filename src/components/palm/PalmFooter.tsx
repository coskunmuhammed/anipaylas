'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Lock } from 'lucide-react';

export default function PalmFooter() {
  const currentYear = new Date().getFullYear();
  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <footer
      style={{
        backgroundColor: 'var(--palm-black)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: 'var(--palm-muted)',
        fontSize: '0.88rem',
        padding: '80px 24px 40px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '48px',
          marginBottom: '60px',
        }}
      >
        {/* Col 1: Brand */}
        <div>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.12em', color: '#ffffff' }}>
              PALM
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 300, letterSpacing: '0.12em', color: '#ffffff', position: 'relative' }}>
              STUDIO
              <span style={{ fontSize: '0.55rem', position: 'absolute', top: '0px', right: '-10px', color: 'var(--palm-gold)' }}>
                ®
              </span>
            </span>
          </Link>
          <p style={{ lineHeight: 1.6, color: 'var(--palm-muted)', maxWidth: '300px' }}>
            {siteConfig.description}
          </p>
        </div>

        {/* Col 2: Keşfet */}
        <div>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: '#ffffff', textTransform: 'uppercase', marginBottom: '20px' }}>
            KEŞFET
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link href="/konseptler" style={{ color: 'var(--palm-muted)', transition: 'color 0.2s' }}>Konseptler</Link></li>
            <li><Link href="/hizmetler" style={{ color: 'var(--palm-muted)', transition: 'color 0.2s' }}>Hizmetler</Link></li>
            <li><Link href="/galeri" style={{ color: 'var(--palm-muted)', transition: 'color 0.2s' }}>Galeri & Portföy</Link></li>
            <li><Link href="/hizmetler/dijital-ani-albumu" style={{ color: 'var(--palm-gold-light)', fontWeight: 600 }}>Dijital Anı Albümü (QR)</Link></li>
          </ul>
        </div>

        {/* Col 3: Kurumsal */}
        <div>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: '#ffffff', textTransform: 'uppercase', marginBottom: '20px' }}>
            KURUMSAL
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link href="/hakkimizda" style={{ color: 'var(--palm-muted)' }}>Hakkımızda</Link></li>
            <li><Link href="/paketler" style={{ color: 'var(--palm-muted)' }}>Paket Seçenekleri</Link></li>
            <li><Link href="/iletisim" style={{ color: 'var(--palm-muted)' }}>Sıkça Sorulan Sorular</Link></li>
            <li>
              <Link href="/admin" style={{ color: 'var(--palm-gold)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} />
                <span>Yönetici & Admin Girişi</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: İletişim */}
        <div>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: '#ffffff', textTransform: 'uppercase', marginBottom: '20px' }}>
            İLETİŞİM
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {siteConfig.phone && (
              <li><a href={`tel:${siteConfig.phone}`} style={{ color: 'var(--palm-muted)' }}>{siteConfig.phone}</a></li>
            )}
            <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--palm-gold-light)', fontWeight: 600 }}>WhatsApp İletişim Hattı</a></li>
            {siteConfig.email && (
              <li><a href={`mailto:${siteConfig.email}`} style={{ color: 'var(--palm-muted)' }}>{siteConfig.email}</a></li>
            )}
            <li style={{ color: 'var(--palm-muted)' }}>Didim / Aydın, Türkiye</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <div>
          &copy; {currentYear} {siteConfig.name}. Tüm hakları saklıdır.
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>Didim Düğün Fotoğrafçılığı & Çekim Hizmetleri</span>
          <span>·</span>
          <a
            href="https://altunmedya.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--palm-gold)',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(201, 170, 103, 0.1)',
              border: '1px solid rgba(201, 170, 103, 0.3)',
            }}
          >
            <span>ALTUN MEDYA</span>
            <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 400 }}>Yazılım & Medya</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

