'use client';

import React from 'react';
import GoldButton from './GoldButton';
import { ArrowRight } from 'lucide-react';

export default function ReservationCTA() {
  return (
    <section
      style={{
        padding: '80px 24px',
        backgroundColor: 'var(--palm-deep-brown)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          backgroundColor: '#261f1a',
          border: '1px solid rgba(201, 170, 103, 0.25)',
          borderRadius: '32px',
          padding: '60px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '40px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          background: 'radial-gradient(circle at 100% 0%, rgba(201, 170, 103, 0.1) 0%, transparent 60%)',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
            HAZIR MISINIZ?
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Tarihinizi seçin,{' '}
            <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>
              size özel teklifinizi hazırlayalım.
            </span>
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--palm-muted)', lineHeight: 1.6 }}>
            Online rezervasyon talebinizi iletin veya WhatsApp hattımız üzerinden 2 dakikada detaylı teklif alın.
          </p>
        </div>

        <div>
          <GoldButton href="/rezervasyon" style={{ padding: '18px 38px', fontSize: '1rem' }}>
            <span>Rezervasyona Başla</span>
            <ArrowRight size={18} />
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
