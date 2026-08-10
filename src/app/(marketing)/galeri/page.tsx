'use client';

import React, { useState } from 'react';
import { galleryData } from '@/data/gallery';
import { siteConfig } from '@/config/site';
import { MessageCircle, Camera } from 'lucide-react';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const whatsappLink = siteConfig.getWhatsAppLink('Merhaba Palm Studio, fotoğraf ve video çekim portföyünüzü inceledim. Özel çekim teklifi almak istiyorum.');

  const categories = [
    { key: 'all', label: 'Tüm Kareler' },
    { key: 'fotograf', label: 'Fotoğraf Çekimi' },
    { key: 'sahil', label: 'Sahil Çekimi' },
    { key: 'video', label: 'Sinematik Video' },
    { key: 'kir', label: 'Kır Çekimi' },
    { key: 'detay', label: 'Detay Çekimleri' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryData 
    : galleryData.filter((item) => item.category === selectedCategory);

  return (
    <div style={{ backgroundColor: 'var(--palm-black)', color: 'var(--palm-cream)', minHeight: '100vh' }}>
      {/* Header Banner */}
      <section style={{ backgroundColor: 'var(--palm-deep-brown)', borderBottom: '1px solid var(--palm-border)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--palm-gold)', fontWeight: 700, marginBottom: '14px', display: 'block' }}>
            PORTFÖY & ÇEKİM GALERİSİ
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#ffffff', marginBottom: '20px', lineHeight: 1.15 }}>
            Örnek Çekim Çalışmalarımız
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: 'var(--palm-muted)', lineHeight: '1.7' }}>
            Ege sahil şeridi, kır konseptleri ve dış mekan plato çekimlerimizden öne çıkan zamansız karelerimiz.
          </p>
        </div>
      </section>

      {/* Main Gallery Area */}
      <section style={{ padding: '60px 24px 100px 24px', backgroundColor: 'var(--palm-black)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '20px',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? 'var(--palm-gold)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#0d0b09' : '#ffffff',
                    border: isSelected ? '1px solid var(--palm-gold)' : '1px solid var(--palm-border)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Photo Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="palm-card" 
                style={{ 
                  padding: '0', 
                  overflow: 'hidden', 
                  backgroundColor: 'var(--palm-surface)', 
                  border: '1px solid var(--palm-border)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
              >
                <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', backgroundColor: 'rgba(13, 11, 9, 0.85)', color: 'var(--palm-gold)', border: '1px solid var(--palm-border)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={13} />
                    <span>{item.categoryLabel}</span>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#ffffff', fontWeight: 700, marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--palm-muted)', lineHeight: '1.5' }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold">
              <MessageCircle size={18} />
              <span>Kendi Çekiminizi Planlayın (WhatsApp)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
