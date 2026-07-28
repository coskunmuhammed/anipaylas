'use client';

import React from 'react';
import GoldButton from './GoldButton';
import { Calendar } from 'lucide-react';

export default function MemoryStatement() {
  return (
    <section
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-black)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* 3-Column Layout: Script Left | Polaroids Center | Script Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            gap: '40px',
            marginBottom: '60px',
          }}
        >
          {/* Left Title */}
          <div style={{ textAlign: 'center' }}>
            <h2
              className="font-script"
              style={{
                fontSize: 'clamp(4rem, 8vw, 7rem)',
                color: '#ffffff',
                lineHeight: 1,
                fontWeight: 400,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              Düğün<br />Geçer
            </h2>
          </div>

          {/* Center 3 Stacked Polaroids */}
          <div
            style={{
              position: 'relative',
              height: '340px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Left Back Polaroid */}
            <div
              style={{
                position: 'absolute',
                width: '190px',
                height: '240px',
                backgroundColor: '#ffffff',
                padding: '10px 10px 32px 10px',
                borderRadius: '6px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                transform: 'rotate(-12deg) translateX(-45px)',
                transition: 'transform 0.3s ease',
                zIndex: 1,
              }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
                  alt="Düğün Anı Çekimi"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right Back Polaroid */}
            <div
              style={{
                position: 'absolute',
                width: '190px',
                height: '240px',
                backgroundColor: '#ffffff',
                padding: '10px 10px 32px 10px',
                borderRadius: '6px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                transform: 'rotate(10deg) translateX(45px)',
                transition: 'transform 0.3s ease',
                zIndex: 2,
              }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  alt="Düğün Konsept Çekimi"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Center Top Polaroid */}
            <div
              style={{
                position: 'relative',
                width: '210px',
                height: '260px',
                backgroundColor: '#ffffff',
                padding: '12px 12px 36px 12px',
                borderRadius: '6px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
                transform: 'rotate(-2deg)',
                transition: 'transform 0.3s ease',
                zIndex: 3,
              }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
                  alt="Didim Düğün Fotoğrafı"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Right Title */}
          <div style={{ textAlign: 'center' }}>
            <h2
              className="font-script"
              style={{
                fontSize: 'clamp(4rem, 8vw, 7rem)',
                color: 'var(--palm-gold-light)',
                lineHeight: 1,
                fontWeight: 400,
                textShadow: '0 4px 20px rgba(201, 170, 103, 0.3)',
              }}
            >
              Anılar<br />Kalır
            </h2>
          </div>
        </div>

        {/* Lower Description & CTA */}
        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: 'var(--palm-muted)',
            maxWidth: '640px',
            margin: '0 auto 36px auto',
          }}
        >
          Onca masrafın içinde, yıllar sonra hâlâ yanınızda olan tek şey. Zor günleri biliyoruz — kalıcı olanı da.
        </p>

        <GoldButton href="/rezervasyon" style={{ padding: '16px 36px', fontSize: '0.95rem' }}>
          <Calendar size={18} />
          <span>HEMEN REZERVASYON OLUŞTUR!</span>
        </GoldButton>

      </div>
    </section>
  );
}
