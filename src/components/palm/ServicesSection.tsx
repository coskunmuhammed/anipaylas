'use client';

import React from 'react';
import Link from 'next/link';
import { businessConfig } from '@/config/business';
import { ArrowRight, QrCode } from 'lucide-react';

export const servicesList = [
  {
    id: 'fotograf-cekimi',
    title: 'Fotoğraf Çekimi',
    slug: 'fotograf-cekimi',
    description: 'Doğal plato ışığında, fark yaratan retouch dokunuşuyla en iyi kareler.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'video-cekimi',
    title: 'Video Çekimi',
    slug: 'video-cekimi',
    description: 'Fotoğrafla aynı anda; anlarınız unutulmaz sinematik bir filme dönüşür.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sac-makyaj',
    title: 'Saç & Makyaj',
    slug: 'sac-makyaj',
    description: 'Platonun kalbinde; makyajınız hiç bozulmadan çekimi kusursuz tamamlayın.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gelinlik',
    title: 'Gelinlik Kiralama',
    slug: 'gelinlik',
    description: '200+ özel tasarım model; showroom’da konforlu kabinlerde profesyonel hazırlık.',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'album-baski',
    title: 'Albüm Baskı',
    slug: 'album-baski',
    description: 'Kareleriniz yıpranmadan, eskimeden bir ömür boyu sizinle yaşasın.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'organizasyon',
    title: 'Organizasyon',
    slug: 'organizasyon',
    description: 'Mekân süslemesi, konsept dekorlar ve tüm davet akışının profesyonel planlaması.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dijital-ani-albumu',
    title: 'Dijital Anı Albümü',
    slug: 'dijital-ani-albumu',
    description: 'Misafirleriniz QR kod ile üye olmadan kendi çektikleri fotoğrafları anında yükler.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    isHighlight: true,
  },
];

export default function ServicesSection() {
  const verifiedStats = businessConfig.stats.filter((s) => s.verified);

  return (
    <section
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-black)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
            HİZMETLER
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
            }}
          >
            Tüm Hizmetler{' '}
            <span style={{ color: 'var(--palm-gold)' }}>Palm Studio®</span> ’da
          </h2>
        </div>

        {/* Services Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '80px',
          }}
        >
          {servicesList.map((service) => (
            <div
              key={service.id}
              className="palm-card"
              style={{
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: service.isHighlight ? '#2e241c' : 'var(--palm-surface)',
                borderColor: service.isHighlight ? 'var(--palm-gold)' : 'var(--palm-border)',
              }}
            >
              {/* Vertical Image Framing */}
              <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(26, 20, 15, 0.9) 0%, transparent 60%)',
                  }}
                />
                {service.isHighlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      padding: '6px 14px',
                      backgroundColor: 'var(--palm-gold)',
                      color: '#0d0b09',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <QrCode size={14} />
                    <span>ÖZEL QR MODÜLÜ</span>
                  </div>
                )}
              </div>

              {/* Text Area */}
              <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '10px',
                  }}
                >
                  {service.title}
                </h3>
                
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--palm-muted)',
                    lineHeight: 1.6,
                    marginBottom: '24px',
                    flex: 1,
                  }}
                >
                  {service.description}
                </p>

                <Link
                  href={`/hizmetler/${service.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--palm-gold-light)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>İNCELE</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Verified Stats Counter Strip */}
        {verifiedStats.length > 0 && (
          <div
            style={{
              backgroundColor: '#17120e',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '32px 24px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            {verifiedStats.map((stat, idx) => (
              <div key={idx}>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                    fontWeight: 700,
                    color: 'var(--palm-gold)',
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--palm-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
