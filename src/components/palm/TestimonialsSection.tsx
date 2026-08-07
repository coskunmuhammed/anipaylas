'use client';

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Quote } from 'lucide-react';
import { DEFAULT_HOMEPAGE_CONTENT } from '@/types/siteContent';

export default function TestimonialsSection() {
  const [cmsData, setCmsData] = useState({
    eyebrow: 'MUTLU ÇİFTLERİMİZ',
    title: 'Hikâyelerine Tanık Olduğumuz Çiftler Ne Diyor?',
    description: 'Türkiye’nin dört bir yanından Didim’e gelen çiftlerimizin unutulmaz çekim deneyimleri ve geri bildirimleri.',
    items: DEFAULT_HOMEPAGE_CONTENT.testimonials.items,
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content/homepage');
        const json = await res.json();
        if (json.success && json.data?.testimonials) {
          setCmsData({
            eyebrow: json.data.testimonials.eyebrow || 'MUTLU ÇİFTLERİMİZ',
            title: json.data.testimonials.title || 'Hikâyelerine Tanık Olduğumuz Çiftler Ne Diyor?',
            description: json.data.testimonials.description || 'Türkiye’nin dört bir yanından Didim’e gelen çiftlerimizin unutulmaz çekim deneyimleri ve geri bildirimleri.',
            items: json.data.testimonials.items && json.data.testimonials.items.length > 0 ? json.data.testimonials.items : DEFAULT_HOMEPAGE_CONTENT.testimonials.items,
          });
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

  const activeReviews = cmsData.items && cmsData.items.length > 0 ? cmsData.items : DEFAULT_HOMEPAGE_CONTENT.testimonials.items;

  return (
    <section
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-deep-brown)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Subtitle / Eyebrow */}
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
          {cmsData.eyebrow}
        </div>

        {/* Heading */}
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>
          {cmsData.title}
        </h2>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--palm-muted)', maxWidth: '680px', margin: '0 auto 60px auto', lineHeight: 1.7 }}>
          {cmsData.description}
        </p>

        {/* Reviews Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {activeReviews.map((review, idx) => (
            <div 
              key={review.id || idx} 
              style={{ 
                textAlign: 'left', 
                padding: '32px 28px',
                backgroundColor: 'var(--palm-surface)',
                border: '1px solid rgba(201, 170, 103, 0.25)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                position: 'relative',
              }}
            >
              <div>
                {/* Header Star Rating & Quote Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '4px', color: 'var(--palm-gold)' }}>
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <Star key={i} size={18} fill="var(--palm-gold)" style={{ color: 'var(--palm-gold)' }} />
                    ))}
                  </div>
                  <Quote size={24} style={{ color: 'rgba(201, 170, 103, 0.3)' }} />
                </div>

                {/* Review Text */}
                <p style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: '0.98rem', color: '#e8e2d9', lineHeight: 1.7, marginBottom: '24px' }}>
                  &quot;{review.text}&quot;
                </p>
              </div>

              {/* Author & Location */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                    {review.name}
                  </div>
                  {review.location && (
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--palm-gold)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={12} />
                      <span>{review.location}</span>
                    </div>
                  )}
                </div>

                {review.date && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--palm-muted)' }}>
                    {review.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
