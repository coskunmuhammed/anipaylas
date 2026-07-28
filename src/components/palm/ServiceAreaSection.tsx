'use client';

import React from 'react';
import { businessConfig } from '@/config/business';
import { MapPin } from 'lucide-react';

export default function ServiceAreaSection() {
  return (
    <section
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-deep-brown)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Subtitle & Title */}
        <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
          NEREDEN GELİYORLAR?
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}
        >
          Didim’deyiz,{' '}
          <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>
            hikâyeleriniz her yerden geliyor.
          </span>
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--palm-muted)',
            lineHeight: 1.7,
            maxWidth: '680px',
            margin: '0 auto 50px auto',
          }}
        >
          Didim, Aydın, İzmir, Kuşadası, Bodrum ve çevre bölgelerden gelen çiftlerimiz için çekim ve etkinlik süreçlerini tek çatı altında planlıyoruz.
        </p>

        {/* Ege Regional Service Area Pills Grid */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            maxWidth: '900px',
            margin: '0 auto 60px auto',
          }}
        >
          {businessConfig.serviceAreas.map((city, idx) => (
            <div
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(201, 170, 103, 0.25)',
                borderRadius: '40px',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              <MapPin size={16} style={{ color: 'var(--palm-gold)' }} />
              <span>{city}</span>
            </div>
          ))}
        </div>

        {/* Minimal Aegean Map Styling Frame */}
        <div
          style={{
            backgroundColor: '#1c1611',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '48px 32px',
            maxWidth: '960px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
            MERKEZ STÜDYO: DİDİM / AYDIN
          </div>
          <div style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 600 }}>
            Tüm çekimler ve organizasyon detayları stüdyomuz koordinasyonunda yönetilir.
          </div>
        </div>

      </div>
    </section>
  );
}
