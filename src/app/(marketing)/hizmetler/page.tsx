import React from 'react';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import { siteConfig } from '@/config/site';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Hizmetlerimiz | Palm Stüdyo - Organizasyon & Dijital Anı Albümü',
  description: 'Düğün, kına, nişan, söz, doğum günü ve kurumsal organizasyon hizmetlerimiz ile Palm Stüdyo Dijital Anı Albümü modülü.',
};

export default function ServicesPage() {
  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <div style={{ color: '#1E2522' }}>
      {/* Header Banner */}
      <section style={{ backgroundColor: '#183D35', color: '#F8F6F1', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B59A63', fontWeight: 700, marginBottom: '12px', display: 'block' }}>
            HİZMET PORTFÖYÜMÜZ
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#F8F6F1', marginBottom: '20px' }}>
            A’dan Z’ye Etkinlik Çözümleri
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#DCCDBD', lineHeight: '1.7' }}>
            Tasarım, mekân süsleme, canlı koordinasyon ve misafirleriniz için dijital anı albümü hizmetlerimizle tanışın.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
          {servicesData.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                className="palm-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '40px',
                  alignItems: 'center',
                  padding: '40px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ order: isEven ? 1 : 2, height: '320px', borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={service.coverImage} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ order: isEven ? 2 : 1 }}>
                  <span className="palm-tag" style={{ marginBottom: '12px' }}>{service.title}</span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: '#183D35', marginBottom: '16px' }}>
                    {service.title}
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: '#4a5568', lineHeight: '1.7', marginBottom: '24px' }}>
                    {service.fullDesc}
                  </p>

                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#557A67', textTransform: 'uppercase', marginBottom: '12px' }}>ÖNE ÇIKAN ÖZELLİKLER</div>
                    <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.9rem', color: '#1E2522' }}>
                      {service.features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles size={14} style={{ color: '#B59A63' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Link href={`/hizmetler/${service.slug}`} className="palm-btn-primary">
                      <span>Hizmet Detayları</span>
                      <ArrowRight size={16} />
                    </Link>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-secondary">
                      <MessageCircle size={16} />
                      <span>Teklif Al</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
