'use client';

import React, { useState, useEffect } from 'react';
import GoldButton from './GoldButton';
import { ArrowRight } from 'lucide-react';

export default function ReservationCTA() {
  const [cmsData, setCmsData] = useState({
    eyebrow: 'REZERVASYON & İLETİŞİM',
    title: 'Hayalinizdeki Çekimi Birlikte Planlayalım',
    description: 'Etkinlik tarihinizin uygunluğunu sorgulamak, konsept önerisi almak ve özel fiyat teklifimizi öğrenmek için bizimle anında iletişime geçin.',
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content/homepage');
        const json = await res.json();
        if (json.success && json.data?.contact) {
          setCmsData(json.data.contact);
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

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
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
            {cmsData.eyebrow}
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
            {cmsData.title}
          </h2>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--palm-muted)', lineHeight: 1.6 }}>
            {cmsData.description}
          </p>
        </div>

        <div>
          <GoldButton href="/iletisim" style={{ padding: '18px 38px', fontSize: '1rem' }}>
            <span>İletişime Geçin & Teklif Alın</span>
            <ArrowRight size={18} />
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
