'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface SignatureConceptsProps {
  initialData?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: typeof signatureConceptsList;
  };
}

export default function SignatureConcepts({ initialData }: SignatureConceptsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const cmsData = {
    eyebrow: initialData?.eyebrow || 'İMZA KONSEPTLER',
    title: initialData?.title || 'Aşkınızı Sanata Dönüştüren Temalar',
    description: initialData?.description || 'Aşk Bahçeleri, Antik Kentsel Miras, Ege Gün Batımı ve Minimal Lüks Stüdyo konseptlerimizle hayalinizdeki kareleri ölümsüzleştiriyoruz.',
    items: initialData?.items && initialData.items.length > 0 ? initialData.items : signatureConceptsList,
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

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
        
        {/* Heading & Scroll Navigation Arrows */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
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

          {/* Carousel Scroll Control Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={scrollLeft}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 170, 103, 0.3)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              aria-label="Sola Kaydır"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--palm-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={scrollRight}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 170, 103, 0.3)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              aria-label="Sağa Kaydır"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--palm-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Horizontal Drag/Swipe Carousel Container */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '24px',
            scrollbarWidth: 'none',
          }}
        >
          {activeConcepts.map((concept) => {
            const isHovered = hoveredSlug === concept.slug;
            return (
              <div
                key={concept.slug}
                onMouseEnter={() => setHoveredSlug(concept.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                style={{
                  flex: '0 0 320px',
                  scrollSnapAlign: 'start',
                  height: '460px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: isHovered ? '1px solid var(--palm-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
                  transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered ? '0 20px 40px rgba(201, 170, 103, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 0.5s ease',
                  }}
                >
                  <PalmImage
                    src={concept.image}
                    alt={concept.title}
                    fill
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isHovered
                      ? 'linear-gradient(to top, rgba(13, 11, 9, 0.96) 0%, rgba(13, 11, 9, 0.3) 60%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(13, 11, 9, 0.95) 0%, rgba(13, 11, 9, 0.2) 60%, transparent 100%)',
                    transition: 'background 0.3s ease',
                  }}
                />

                {/* Tag Header */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 2 }}>
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
                      backgroundColor: isHovered ? 'var(--palm-gold)' : 'rgba(255, 255, 255, 0.9)',
                      color: '#0d0b09',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`${concept.title} Tanıtım Videosunu İzle`}
                  >
                    <Play size={24} style={{ marginLeft: '4px' }} />
                  </button>
                )}

                {/* Lower Details */}
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 2 }}>
                  {concept.isDemo && (
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--palm-gold)', marginBottom: '4px' }}>
                      ÖRNEN KONSEPT
                    </div>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 600, color: isHovered ? 'var(--palm-gold-light)' : '#ffffff', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                    {concept.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--palm-muted)', lineHeight: 1.5 }}>
                    {concept.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

