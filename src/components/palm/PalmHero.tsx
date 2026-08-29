'use client';

import React, { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { PhoneCall, Calendar } from 'lucide-react';
import GoldButton from './GoldButton';
import { HomepageContent, DEFAULT_HOMEPAGE_CONTENT } from '@/types/siteContent';
import { getMediaUrl } from '@/lib/mediaUrl';

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

  // Ensure photo pool has at least 6 photos for column variety
  const photoPool = bgPhotos.length >= 6 
    ? bgPhotos 
    : [...bgPhotos, ...bgPhotos, ...bgPhotos].slice(0, 6);

  // 6 staggered columns, duplicated for seamless infinite scroll
  const col1Photos = [...photoPool, ...photoPool];
  const col2Photos = [...photoPool.slice(1), ...photoPool.slice(0, 1), ...photoPool.slice(1), ...photoPool.slice(0, 1)];
  const col3Photos = [...photoPool.slice(2), ...photoPool.slice(0, 2), ...photoPool.slice(2), ...photoPool.slice(0, 2)];
  const col4Photos = [...photoPool.slice(3), ...photoPool.slice(0, 3), ...photoPool.slice(3), ...photoPool.slice(0, 3)];
  const col5Photos = [...photoPool.slice(4), ...photoPool.slice(0, 4), ...photoPool.slice(4), ...photoPool.slice(0, 4)];
  const col6Photos = [...photoPool.slice(5), ...photoPool.slice(0, 5), ...photoPool.slice(5), ...photoPool.slice(0, 5)];

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
      {/* Dynamic Diagonal Floating Photo Grid Background (Edge to Edge 6-Column) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '160vw',
          minWidth: '1800px',
          height: '160vh',
          minHeight: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          transform: 'translate(-50%, -50%) rotate(-10deg) scale(1.15)',
          opacity: 0.58,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {/* Column 1 (Scrolls Up) */}
        <div className="palm-hero-column-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {col1Photos.map((img, idx) => (
            <div key={`col1-${idx}`} style={{ width: '240px', height: '320px', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)', flexShrink: 0 }}>
              <img src={getMediaUrl(img)} alt="Palm Studio Çekim" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Column 2 (Scrolls Down) */}
        <div className="palm-hero-column-down" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {col2Photos.map((img, idx) => (
            <div key={`col2-${idx}`} style={{ width: '240px', height: '320px', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)', flexShrink: 0 }}>
              <img src={getMediaUrl(img)} alt="Palm Studio Düğün" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Column 3 (Scrolls Up) */}
        <div className="palm-hero-column-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {col3Photos.map((img, idx) => (
            <div key={`col3-${idx}`} style={{ width: '240px', height: '320px', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)', flexShrink: 0 }}>
              <img src={getMediaUrl(img)} alt="Palm Studio Konsept" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Column 4 (Scrolls Down) */}
        <div className="palm-hero-column-down" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {col4Photos.map((img, idx) => (
            <div key={`col4-${idx}`} style={{ width: '240px', height: '320px', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)', flexShrink: 0 }}>
              <img src={getMediaUrl(img)} alt="Palm Studio Dış Mekan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Column 5 (Scrolls Up) */}
        <div className="palm-hero-column-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {col5Photos.map((img, idx) => (
            <div key={`col5-${idx}`} style={{ width: '240px', height: '320px', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)', flexShrink: 0 }}>
              <img src={getMediaUrl(img)} alt="Palm Studio Albüm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Column 6 (Scrolls Down) */}
        <div className="palm-hero-column-down" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {col6Photos.map((img, idx) => (
            <div key={`col6-${idx}`} style={{ width: '240px', height: '320px', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)', flexShrink: 0 }}>
              <img src={getMediaUrl(img)} alt="Palm Studio Etkinlik" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Dark Gradient Backdrop Overlay for Text Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(13, 11, 9, 0.42) 0%, rgba(13, 11, 9, 0.85) 80%)',
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
              letterSpacing: '-0.03em',
              textShadow: '0 4px 30px rgba(0,0,0,0.8)',
            }}
          >
            <span style={{ fontWeight: 900, color: '#ffffff' }}>PALM </span>
            <span style={{ fontWeight: 300, color: '#ffffff', letterSpacing: '0.04em' }}>STUDIO</span>
          </span>

          {/* Title Line 2: 3-line layout if contains '&' */}
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
              fontWeight: 500,
              fontStyle: 'italic',
              color: 'var(--palm-gold)',
              background: 'linear-gradient(135deg, #f0dfa8 0%, #c9aa67 60%, #9e7f41 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 30px rgba(201, 170, 103, 0.25)',
              marginTop: '12px',
              gap: '4px',
            }}
          >
            {(() => {
              const text = heroData.titleLine2 || 'Özel Çekim Konseptleri & Dijital Anı Albümü';
              if (text.includes('&')) {
                const parts = text.split('&');
                return (
                  <>
                    <span>{parts[0].trim()}</span>
                    <span style={{ fontSize: '0.7em', fontStyle: 'italic', opacity: 0.9 }}>&</span>
                    <span>{parts.slice(1).join('&').trim()}</span>
                  </>
                );
              }
              return <span>{text}</span>;
            })()}
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
