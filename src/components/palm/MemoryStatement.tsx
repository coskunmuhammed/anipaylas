'use client';

import React, { useState, useEffect, useRef } from 'react';
import GoldButton from './GoldButton';
import { Calendar } from 'lucide-react';
import { DEFAULT_HOMEPAGE_CONTENT } from '@/types/siteContent';

export default function MemoryStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [photos, setPhotos] = useState(DEFAULT_HOMEPAGE_CONTENT.memoryStatement);

  // Fetch CMS content
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content/homepage');
        const json = await res.json();
        if (json.success && json.data?.memoryStatement) {
          setPhotos(json.data.memoryStatement);
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

  // Track scroll progress as section passes through viewport
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start opening when top of section comes into view, fully open when section center reaches viewport center
      const startThreshold = windowHeight * 0.9;
      const endThreshold = windowHeight * 0.2;

      let progress = (startThreshold - rect.top) / (startThreshold - endThreshold);
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute fanning factors (combines scroll progress and hover boost)
  const factor = isHovered ? 1.3 : scrollProgress;

  // Left card opens sideways to left
  const leftRotate = -10 - factor * 16; // -10deg -> -26deg
  const leftTranslateX = -25 - factor * 105; // -25px -> -130px
  const leftTranslateY = factor * 15;

  // Right card opens sideways to right
  const rightRotate = 8 + factor * 16; // 8deg -> 24deg
  const rightTranslateX = 25 + factor * 105; // 25px -> 130px
  const rightTranslateY = factor * 15;

  // Center card lifts up slightly
  const centerRotate = -2 + factor * 2;
  const centerTranslateY = -factor * 22;
  const centerScale = 1 + factor * 0.08;

  return (
    <section
      ref={sectionRef}
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
              style={{
                fontFamily: 'var(--font-adineue)',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
                color: '#ffffff',
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textShadow: '0 4px 30px rgba(0,0,0,0.8)',
              }}
            >
              Düğün<br />Geçer
            </h2>
          </div>

          {/* Center 3 Stacked Polaroids (Fans out sideways on scroll) */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: 'relative',
              height: '360px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
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
                boxShadow: '0 16px 36px rgba(0,0,0,0.7)',
                transform: `rotate(${leftRotate}deg) translateX(${leftTranslateX}px) translateY(${leftTranslateY}px)`,
                transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: 1,
              }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
                <img
                  src={photos.photo1 || DEFAULT_HOMEPAGE_CONTENT.memoryStatement.photo1}
                  alt="Düğün Anı Çekimi 1"
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
                boxShadow: '0 16px 36px rgba(0,0,0,0.7)',
                transform: `rotate(${rightRotate}deg) translateX(${rightTranslateX}px) translateY(${rightTranslateY}px)`,
                transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: 2,
              }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
                <img
                  src={photos.photo2 || DEFAULT_HOMEPAGE_CONTENT.memoryStatement.photo2}
                  alt="Düğün Anı Çekimi 2"
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
                boxShadow: '0 20px 45px rgba(0,0,0,0.8)',
                transform: `rotate(${centerRotate}deg) translateY(${centerTranslateY}px) scale(${centerScale})`,
                transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: 3,
              }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
                <img
                  src={photos.photo3 || DEFAULT_HOMEPAGE_CONTENT.memoryStatement.photo3}
                  alt="Didim Düğün Fotoğrafı 3"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Right Title */}
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-adineue)',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
                color: 'var(--palm-gold-light)',
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textShadow: '0 4px 30px rgba(201, 170, 103, 0.25)',
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
            fontFamily: 'var(--font-sans)',
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
