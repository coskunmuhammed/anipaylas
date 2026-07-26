import React from 'react';
import { packagesData } from '@/data/packages';
import { siteConfig } from '@/config/site';
import { CheckCircle2, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Paketler & Kapsamlar | Palm Stüdyo',
  description: 'Düğün, kına ve nişan organizasyonlarınız için Palm Stüdyo paket seçenekleri.',
};

export default function PackagesPage() {
  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <div style={{ color: '#1E2522' }}>
      <section style={{ backgroundColor: '#183D35', color: '#F8F6F1', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B59A63', fontWeight: 700, marginBottom: '12px', display: 'block' }}>
            PAKET KAPSAMLARI
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#F8F6F1', marginBottom: '20px' }}>
            İhtiyacınıza Özel Çözümler
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#DCCDBD', lineHeight: '1.7' }}>
            Fiyatlarımız etkinlik mekanı, davetli sayısı ve özel tasarım taleplerinize göre kişiye özel teklif olarak hazırlanır.
          </p>
        </div>
      </section>

      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {packagesData.map((pkg) => (
              <div
                key={pkg.id}
                className="palm-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: pkg.isPopular ? '2px solid #B59A63' : '1px solid var(--palm-border)',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                }}
              >
                {pkg.badge && (
                  <div style={{ position: 'absolute', top: '-14px', right: '24px', padding: '4px 16px', backgroundColor: '#B59A63', color: '#ffffff', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {pkg.badge}
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: '#183D35', marginBottom: '8px' }}>
                  {pkg.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#557A67', fontWeight: 600, marginBottom: '20px' }}>
                  {pkg.tagline}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6', marginBottom: '28px' }}>
                  {pkg.description}
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px', flex: 1 }}>
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#1E2522' }}>
                      <CheckCircle2 size={18} style={{ color: '#557A67', flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={pkg.isPopular ? 'palm-btn-gold' : 'palm-btn-primary'} style={{ width: '100%' }}>
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
