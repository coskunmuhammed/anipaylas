'use client';

import React, { useState, useEffect } from 'react';
import GoldButton from './GoldButton';
import { ArrowRight } from 'lucide-react';

interface ReservationCTAProps {
  initialData?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
}

export default function ReservationCTA({ initialData }: ReservationCTAProps) {
  const cmsData = {
    eyebrow: initialData?.eyebrow || 'REZERVASYON & İLETİŞİM',
    title: initialData?.title || 'Hayalinizdeki Çekimi Birlikte Planlayalım',
    description: initialData?.description || 'Etkinlik tarihinizin uygunluğunu sorgulamak, konsept önerisi almak ve özel fiyat teklifimizi öğrenmek için bizimle anında iletişime geçin.',
  };

  return (
    <section
      style={{
        padding: '80px 24px',
        backgroundColor: 'var(--palm-deep-brown)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="palm-cta-container"
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
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
            {cmsData.eyebrow}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            {cmsData.title}
          </h2>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--palm-muted)', lineHeight: 1.6 }}>
            {cmsData.description}
          </p>
        </div>

        <div className="palm-cta-button-wrapper">
          <GoldButton href="/iletisim" style={{ padding: '16px 30px', fontSize: '0.95rem' }}>
            <span>İletişime Geçin & Teklif Alın</span>
            <ArrowRight size={18} />
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
