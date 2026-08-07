'use client';

import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import PalmImage from './PalmImage';

export interface Concept {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  videoUrl?: string;
  isDemo?: boolean;
}

export const signatureConceptsList: Concept[] = [
  {
    slug: 'bohem-bahce',
    title: 'Bohem Bahçe',
    category: 'BOHEM',
    description: 'Doğal ahşap ve kurutulmuş pampa dokunuşlarıyla rüya gibi bir kır atmosferi.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    isDemo: true,
  },
  {
    slug: 'zamansiz-beyaz',
    title: 'Zamansız Beyaz',
    category: 'ZAMANSIZ',
    description: 'Sade şıklık, beyaz tüller ve zamansız ışık açılarıyla çekilen romantik kareler.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    isDemo: true,
  },
  {
    slug: 'ege-gun-batimi',
    title: 'Ege Gün Batımı',
    category: 'DOĞAL IŞIK',
    description: 'Altın saatlerde sahil şeridinde sinematik ve büyüleyici çift portreleri.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    isDemo: true,
  },
  {
    slug: 'vintage-romance',
    title: 'Vintage Romance',
    category: 'VINTAGE',
    description: 'Nostaljik renk paleti ve nostalji detaylarıyla film estetiğinde konsept.',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
    isDemo: true,
  },
  {
    slug: 'gece-isiklari',
    title: 'Gece Işıkları',
    category: 'GECE',
    description: 'Perili ışıklar ve mum detaylarıyla romantik akşam çekim seti.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    isDemo: true,
  },
];

export default function SignatureConcepts() {
  const [cmsData, setCmsData] = useState({
    eyebrow: 'İMZA KONSEPTLER',
    title: 'Aşkınızı Sanata Dönüştüren Temalar',
    description: 'Aşk Bahçeleri, Antik Kentsel Miras, Ege Gün Batımı ve Minimal Lüks Stüdyo konseptlerimizle hayalinizdeki kareleri ölümsüzleştiriyoruz.',
    items: signatureConceptsList,
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content/homepage');
        const json = await res.json();
        if (json.success && json.data?.concepts) {
          setCmsData({
            eyebrow: json.data.concepts.eyebrow || 'İMZA KONSEPTLER',
            title: json.data.concepts.title || 'Aşkınızı Sanata Dönüştüren Temalar',
            description: json.data.concepts.description || 'Aşk Bahçeleri, Antik Kentsel Miras, Ege Gün Batımı ve Minimal Lüks Stüdyo konseptlerimizle hayalinizdeki kareleri ölümsüzleştiriyoruz.',
            items: json.data.concepts.items && json.data.concepts.items.length > 0 ? json.data.concepts.items : signatureConceptsList,
          });
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

  const activeConcepts = cmsData.items && cmsData.items.length > 0 ? cmsData.items : signatureConceptsList;

  return (
    <section
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-black)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Heading */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
            {cmsData.eyebrow}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            {cmsData.title}
          </h2>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--palm-muted)', maxWidth: '640px', lineHeight: 1.7 }}>
            {cmsData.description}
          </p>
        </div>

        {/* Horizontal Drag/Swipe Carousel Container */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '24px',
            scrollbarWidth: 'none',
          }}
        >
          {activeConcepts.map((concept) => (
            <div
              key={concept.slug}
              style={{
                flex: '0 0 320px',
                scrollSnapAlign: 'start',
                height: '460px',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <PalmImage
                src={concept.image}
                alt={concept.title}
                fill
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13, 11, 9, 0.95) 0%, rgba(13, 11, 9, 0.2) 60%, transparent 100%)',
                }}
              />

              {/* Tag Header */}
              <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                <span className="palm-tag">{concept.category}</span>
              </div>

              {concept.videoUrl && (
                <button
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#0d0b09',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label={`${concept.title} Tanıtım Videosunu İzle`}
                >
                  <Play size={24} style={{ marginLeft: '4px' }} />
                </button>
              )}

              {/* Lower Details */}
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                {concept.isDemo && (
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--palm-gold)', marginBottom: '4px' }}>
                    ÖRNEN KONSEPT
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  {concept.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--palm-muted)', lineHeight: 1.5 }}>
                  {concept.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
