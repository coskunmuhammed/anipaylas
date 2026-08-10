import React from 'react';
import { packagesData } from '@/data/packages';
import { siteConfig } from '@/config/site';
import { CheckCircle2, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Paket Seçenekleri | Palm Studio',
  description: 'Düğün, kına ve nişan çekimleriniz için Palm Studio profesyonel fotoğraf ve video paket seçenekleri.',
};

export default function PackagesPage() {
  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <div style={{ backgroundColor: 'var(--palm-black)', color: 'var(--palm-cream)', minHeight: '100vh' }}>
      <section style={{ backgroundColor: 'var(--palm-deep-brown)', borderBottom: '1px solid var(--palm-border)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--palm-gold)', fontWeight: 700, marginBottom: '14px', display: 'block' }}>
            ÇEKİM PAKETLERİ
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#ffffff', marginBottom: '20px', lineHeight: 1.15 }}>
            İhtiyacınıza Özel Çözümler
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: 'var(--palm-muted)', lineHeight: '1.7' }}>
            Çekim paketlerimizin detayları, etkinlik lokasyonu, çekim süresi ve kurgu taleplerinize göre kişiye özel hazırlanır.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 24px', backgroundColor: 'var(--palm-black)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {packagesData.map((pkg) => (
              <div
                key={pkg.id}
                className="palm-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: pkg.isPopular ? '2px solid var(--palm-gold)' : '1px solid var(--palm-border)',
                  position: 'relative',
                  backgroundColor: 'var(--palm-surface)',
                  padding: '36px',
                }}
              >
                {pkg.badge && (
                  <div style={{ position: 'absolute', top: '-14px', right: '24px', padding: '4px 16px', backgroundColor: 'var(--palm-gold)', color: '#0d0b09', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-sans)' }}>
                    {pkg.badge}
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  {pkg.name}
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--palm-gold)', fontWeight: 600, marginBottom: '20px' }}>
                  {pkg.tagline}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--palm-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
                  {pkg.description}
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px', flex: 1 }}>
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#ffffff', fontFamily: 'var(--font-sans)' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--palm-gold)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={pkg.isPopular ? 'palm-btn-gold' : 'palm-btn-secondary'} style={{ width: '100%', justifyContent: 'center' }}>
                  <MessageCircle size={18} />
                  <span>Teklif Al</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
