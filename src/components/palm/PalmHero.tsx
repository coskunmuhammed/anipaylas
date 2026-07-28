'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { PhoneCall, Calendar } from 'lucide-react';
import GoldButton from './GoldButton';

export default function PalmHero() {
  const callHref = siteConfig.phone ? `tel:${siteConfig.phone}` : siteConfig.getWhatsAppLink();

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '850px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 120px 24px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(38, 30, 24, 0.9) 0%, rgba(13, 11, 9, 1) 70%)',
      }}
    >
      {/* Background Subtle Lighting Accent */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(201, 170, 103, 0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Main Headline with Serif/Sans-Serif Contrast */}
        <h1
          style={{
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(3rem, 7vw, 6.2rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            Didim’in
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3.4rem, 8.5vw, 7.5rem)',
              fontWeight: 500,
              fontStyle: 'normal',
              color: 'var(--palm-gold)',
              background: 'linear-gradient(135deg, #e1c98f 0%, #c9aa67 60%, #a38444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 30px rgba(201, 170, 103, 0.15)',
            }}
          >
            Düğün Fotoğrafçısı
          </span>
        </h1>

        {/* Subtitle Text */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '680px',
            margin: '0 auto 48px auto',
            fontWeight: 400,
          }}
        >
          Fotoğraf, video, konsept çekim, saç & makyaj, gelinlik, albüm baskı ve dijital anı albümü; özel gün deneyiminiz tek çatı altında.
        </p>

        {/* CTA Button Pair */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <GoldButton href="/rezervasyon" variant="gold" style={{ padding: '16px 36px', fontSize: '1rem' }}>
            <Calendar size={18} />
            <span>Rezervasyon Oluştur</span>
          </GoldButton>

          <GoldButton href={callHref} variant="secondary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
            <PhoneCall size={18} />
            <span>Hemen Ara</span>
          </GoldButton>
        </div>

      </div>
    </section>
  );
}
