'use client';

import React from 'react';
import Link from 'next/link';
import SignatureConcepts from '@/components/palm/SignatureConcepts';
import ReservationCTA from '@/components/palm/ReservationCTA';
import { ArrowLeft } from 'lucide-react';

export default function KonseptlerPage() {
  return (
    <div style={{ backgroundColor: 'var(--palm-black)', minHeight: '100vh', color: '#ffffff' }}>
      
      {/* Banner Header */}
      <section
        style={{
          padding: '80px 24px 60px 24px',
          backgroundColor: 'var(--palm-deep-brown)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--palm-gold)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '24px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Anasayfaya Dön</span>
          </Link>

          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--palm-gold)',
              textTransform: 'uppercase',
              marginBottom: '12px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ÖZEL TASARIM İMZA KONSEPTLER
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '18px',
            }}
          >
            Aşkınızı Sanata Dönüştüren{' '}
            <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>
              İmza Çekim Konseptleri
            </span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
              color: 'var(--palm-muted)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Bohem Bahçe, Zamansız Beyaz, Ege Gün Batımı, Vintage Romance ve Gece Işıkları temalarımızla hayalinizdeki dış çekim karelerini hayata geçiriyoruz.
          </p>
        </div>
      </section>

      <SignatureConcepts />
      <ReservationCTA />

    </div>
  );
}
