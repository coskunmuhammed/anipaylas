'use client';

import React from 'react';
import { Play } from 'lucide-react';

export interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  videoUrl?: string;
}

export const storiesList: StoryItem[] = [
  {
    id: '1',
    title: 'Sevginin Sırrı',
    subtitle: 'Çift highlight’ı',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Aşka Doyun',
    subtitle: 'Çift highlight’ı',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Beraberlik Kalpleri Birleştirir',
    subtitle: 'Çift highlight’ı',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
];

export default function StoriesSection() {
  return (
    <section
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-black)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        
        <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
          HİKÂYELER
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: '16px',
          }}
        >
          Gerçek{' '}
          <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>
            Hikâyler
          </span>
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--palm-muted)', maxWidth: '640px', margin: '0 auto 60px auto' }}>
          Çiftlerin highlight videoları; seçtikleri paket ve konseptle birlikte.
        </p>

        {/* 3 Story Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          {storiesList.map((story) => (
            <div
              key={story.id}
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: 'var(--palm-surface)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '360px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={story.image}
                  alt={story.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13, 11, 9, 0.9) 0%, transparent 60%)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'var(--palm-gold-light)',
                    borderRadius: '12px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                  }}
                >
                  HIGHLIGHT
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#0d0b09',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <Play size={24} style={{ marginLeft: '4px' }} />
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                  {story.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--palm-muted)' }}>
                  {story.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
