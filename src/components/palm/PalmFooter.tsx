import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

export default function PalmFooter() {
  const currentYear = new Date().getFullYear();
  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <footer
      style={{
        backgroundColor: '#183D35',
        color: '#F8F6F1',
        padding: '70px 24px 30px 24px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '48px',
          marginBottom: '60px',
        }}
      >
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#B59A63',
                color: '#183D35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
              }}
            >
              P
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#F8F6F1',
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
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#DCCDBD',
                  fontWeight: 600,
                }}
              >
                Etkinlik & Tasarım
              </span>
            </div>
          </div>
          <p style={{ color: '#DCCDBD', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px', maxWidth: '320px' }}>
            {siteConfig.description}
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#F8F6F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
              aria-label="Palm Stüdyo Instagram"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
              aria-label="Palm Stüdyo WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Services Links Column */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#B59A63',
              marginBottom: '20px',
              letterSpacing: '0.02em',
            }}
          >
            Hizmetlerimiz
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li><Link href="/hizmetler/dugun" style={{ color: '#DCCDBD' }}>Düğün Organizasyonu</Link></li>
            <li><Link href="/hizmetler/kina" style={{ color: '#DCCDBD' }}>Kına Gecesi</Link></li>
            <li><Link href="/hizmetler/nisan" style={{ color: '#DCCDBD' }}>Nişan & Söz</Link></li>
            <li><Link href="/hizmetler/dogum-gunu" style={{ color: '#DCCDBD' }}>Doğum Günü & Baby Shower</Link></li>
            <li><Link href="/hizmetler/kurumsal" style={{ color: '#DCCDBD' }}>Kurumsal Etkinlikler</Link></li>
            <li><Link href="/hizmetler/dijital-ani-albumu" style={{ color: '#B59A63', fontWeight: 600 }}>Dijital Anı Albümü (Palm Anılar)</Link></li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#B59A63',
              marginBottom: '20px',
              letterSpacing: '0.02em',
            }}
          >
            Kurumsal
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li><Link href="/hakkimizda" style={{ color: '#DCCDBD' }}>Hakkımızda</Link></li>
            <li><Link href="/galeri" style={{ color: '#DCCDBD' }}>Galeri / Portföy</Link></li>
            <li><Link href="/paketler" style={{ color: '#DCCDBD' }}>Paket Seçenekleri</Link></li>
            <li><Link href="/iletisim" style={{ color: '#DCCDBD' }}>İletişim & Teklif</Link></li>
            <li><Link href="/admin" style={{ color: 'rgba(220, 205, 189, 0.5)', fontSize: '0.8rem' }}>Yönetici Girişi</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#B59A63',
              marginBottom: '20px',
              letterSpacing: '0.02em',
            }}
          >
            İletişim
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#DCCDBD' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} style={{ color: '#B59A63' }} />
              <span>{siteConfig.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <InstagramIcon size={16} style={{ color: '#B59A63' }} />
              <span>@{siteConfig.instagramUsername}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} style={{ color: '#B59A63' }} />
              <span>İstanbul / Türkiye</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'rgba(220, 205, 189, 0.7)',
        }}
      >
        <div>
          &copy; {currentYear} {siteConfig.name}. Tüm hakları saklıdır.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Gizlilik Politikası</span>
          <span>KVKK Aydınlatma Metni</span>
          <span>Kullanım Koşulları</span>
        </div>
      </div>
    </footer>
  );
}
