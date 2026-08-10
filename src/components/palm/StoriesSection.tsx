'use client';

import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import PalmImage from './PalmImage';

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
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Aşka Doyun',
    subtitle: 'Çift highlight’ı',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '3',
    title: 'Beraberlik Kalpleri Birleştirir',
    subtitle: 'Çift highlight’ı',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

export default function StoriesSection() {
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);
  const [cmsData, setCmsData] = useState({
    eyebrow: 'HİKÂYELER',
    title: 'Gerçek Hikâyeler',
    description: 'Çiftlerin highlight videoları; seçtikleri paket ve konseptle birlikte.',
    items: storiesList,
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content/homepage');
        const json = await res.json();
        if (json.success && json.data?.stories) {
          setCmsData({
            eyebrow: json.data.stories.eyebrow || 'HİKÂYELER',
            title: json.data.stories.title || 'Gerçek Hikâyeler',
            description: json.data.stories.description || 'Çiftlerin highlight videoları; seçtikleri paket ve konseptle birlikte.',
            items: json.data.stories.items && json.data.stories.items.length > 0 ? json.data.stories.items : storiesList,
          });
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

  const activeStories = cmsData.items && cmsData.items.length > 0 ? cmsData.items : storiesList;

  const handlePlayStory = (story: StoryItem) => {
    const videoUrl = story.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    setActiveVideo({ title: story.title, url: videoUrl });
  };

  return (
    <section
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-black)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
          {cmsData.eyebrow}
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
          {cmsData.title}
        </h2>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--palm-muted)', maxWidth: '640px', margin: '0 auto 60px auto' }}>
          {cmsData.description}
        </p>

        {/* 3 Story Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          {activeStories.map((story) => (
            <div
              key={story.id}
              onClick={() => handlePlayStory(story)}
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: 'var(--palm-surface)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--palm-gold)';
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ height: '360px', overflow: 'hidden', position: 'relative' }}>
                <PalmImage
                  src={story.image}
                  alt={story.title}
                  fill
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
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--palm-gold)',
                    color: '#0d0b09',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 28px rgba(201, 170, 103, 0.5)',
                    transition: 'transform 0.25s ease',
                  }}
                >
                  <Play size={26} style={{ marginLeft: '4px' }} />
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

      {/* Video Modal Popup */}
      {activeVideo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setActiveVideo(null)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              backgroundColor: '#16120e',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid var(--palm-gold)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#ffffff', margin: 0 }}>
                {activeVideo.title} • Çekim Hikayesi
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Video iFrame / Container */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000' }}>
              <iframe
                src={activeVideo.url}
                title={activeVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

