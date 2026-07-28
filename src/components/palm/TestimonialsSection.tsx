'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { Star } from 'lucide-react';

export interface TestimonialItem {
  name: string;
  image?: string;
  rating: number;
  text: string;
  approvedForPublicUse: boolean;
}

export const testimonialsList: TestimonialItem[] = [];

export default function TestimonialsSection() {
  if (!siteConfig.testimonialsEnabled) {
    return null;
  }

  const approvedReviews = testimonialsList.filter((t) => t.approvedForPublicUse);
  if (approvedReviews.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        padding: '80px 24px',
        backgroundColor: 'var(--palm-deep-brown)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
          DEĞERLENDİRMELER
        </div>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#ffffff', marginBottom: '40px' }}>
          Çiftlerimizin Yorumları
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {approvedReviews.map((review, idx) => (
            <div key={idx} className="palm-card" style={{ textAlign: 'left', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--palm-gold)', marginBottom: '12px' }}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="var(--palm-gold)" />
                ))}
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--palm-cream)', marginBottom: '16px' }}>
                &quot;{review.text}&quot;
              </p>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--palm-gold-light)' }}>
                {review.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
