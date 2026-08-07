'use client';

import React, { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { PhoneCall, Calendar } from 'lucide-react';
import GoldButton from './GoldButton';
import { HomepageContent, DEFAULT_HOMEPAGE_CONTENT } from '@/types/siteContent';

export default function PalmHero() {
  const [heroData, setHeroData] = useState<HomepageContent['hero']>(DEFAULT_HOMEPAGE_CONTENT.hero);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content/homepage');
        const json = await res.json();
        if (json.success && json.data?.hero) {
          setHeroData(json.data.hero);
        }
      } catch (e) {
        // Fallback to default content silently
      }
    }
    loadContent();
  }, []);

  const callHref = siteConfig.phone ? `tel:${siteConfig.phone}` : siteConfig.getWhatsAppLink();
  const bgPhotos = heroData.backgroundPhotos && heroData.backgroundPhotos.length > 0 
    ? heroData.backgroundPhotos 
    : DEFAULT_HOMEPAGE_CONTENT.hero.backgroundPhotos;

  // Duplicate photos for smooth infinite animation loop
  const col1Photos = [...bgPhotos, ...bgPhotos];
  const col2Photos = [...bgPhotos.slice(2), ...bgPhotos, ...bgPhotos.slice(0, 2)];
  const col3Photos = [...bgPhotos.slice(4), ...bgPhotos, ...bgPhotos.slice(0, 4)];

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '840px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '110px 24px 120px 24px',
        overflow: 'hidden',
        backgroundColor: '#0d0b09',
      }}
    >
      {/* Dynamic Diagonal Floating Photo Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          display: 'flex',
          justifyContent: 'center',
          gap: '28px',
          transform: 'rotate(-14deg) scale(1.2)',
          opacity: 0.32,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {/* Column 1 (Scrolls Up) */}
        <div
          className="palm-hero-column-up"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {col1Photos.map((img, idx) => (
            <div
              key={`col1-${idx}`}
              style={{
                width: '240px',
                height: '320px',
                borderRadius: '28px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                flexShrink: 0,
              }}
            >
              <img src={img} alt="Palm Stüdyo Çekim" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Column 2 (Scrolls Down) */}
        <div
          className="palm-hero-column-down"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {col2Photos.map((img, idx) => (
            <div
              key={`col2-${idx}`}
              style={{
                width: '240px',
                height: '320px',
                borderRadius: '28px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                flexShrink: 0,
              }}
            >
              <img src={img} alt="Palm Stüdyo Düğün" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Column 3 (Scrolls Up) */}
        <div
          className="palm-hero-column-up"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {col3Photos.map((img, idx) => (
            <div
              key={`col3-${idx}`}
              style={{
                width: '240px',
                height: '320px',
                borderRadius: '28px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                flexShrink: 0,
              }}
            >
              <img src={img} alt="Palm Stüdyo Konsept" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Dark Gradient Backdrop Overlay for Text Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(13, 11, 9, 0.75) 0%, rgba(13, 11, 9, 0.96) 80%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Background Subtle Gold Lighting Accent */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(201, 170, 103, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      <div style={{ maxWidth: '1020px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
        
        {/* Eyebrow / Pill Badge */}
        {heroData.badgeText && (
          <div
            style={{
              display: 'inline-block',
              padding: '6px 18px',
              backgroundColor: 'rgba(201, 170, 103, 0.15)',
              border: '1px solid rgba(201, 170, 103, 0.4)',
              borderRadius: '30px',
              color: 'var(--palm-gold)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {heroData.badgeText}
          </div>
        )}

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
              fontSize: 'clamp(2.8rem, 6.5vw, 5.8rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              textShadow: '0 4px 30px rgba(0,0,0,0.8)',
            }}
          >
            {heroData.titleLine1 || 'PALM STÜDYO'}
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.8rem, 7vw, 6.2rem)',
              fontWeight: 500,
              fontStyle: 'italic',
              color: 'var(--palm-gold)',
              background: 'linear-gradient(135deg, #f0dfa8 0%, #c9aa67 60%, #9e7f41 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 30px rgba(201, 170, 103, 0.25)',
            }}
          >
            {heroData.titleLine2 || 'Düğün Fotoğrafçılığı & Dijital Anı Albümü'}
          </span>
        </h1>

        {/* Subtitle Text */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            lineHeight: 1.7,
            color: 'var(--palm-muted)',
            maxWidth: '720px',
            margin: '0 auto 48px auto',
            fontWeight: 400,
            fontFamily: 'var(--font-sans)',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {heroData.description}
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
            <span>{heroData.primaryCtaText || 'Randevu & Fiyat Alın'}</span>
          </GoldButton>

          <GoldButton href={callHref} variant="secondary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
            <PhoneCall size={18} />
            <span>{heroData.secondaryCtaText || 'Bizi Arayın'}</span>
          </GoldButton>
        </div>

      </div>
    </section>
  );
}
