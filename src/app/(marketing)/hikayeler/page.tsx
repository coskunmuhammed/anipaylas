'use client';

import React from 'react';
import Link from 'next/link';
import StoriesSection from '@/components/palm/StoriesSection';
import ReservationCTA from '@/components/palm/ReservationCTA';
import { ArrowLeft } from 'lucide-react';

export default function HikayelerPage() {
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
            GERÇEK ÇİFT HİKÂYELERİ & PORTFÖY
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
            Aşk Yolculuklarına Tanık Olduğumuz{' '}
            <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>
              Gerçek Hikâyeler
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
            Didim merkez stüdyomuzda hazırlanan çiftlerimizin düğün hikâyeleri, sinematik highlight klipleri ve özel dış çekim kareleri.
          </p>
        </div>
      </section>

      <StoriesSection />
      <ReservationCTA />

    </div>
  );
}
