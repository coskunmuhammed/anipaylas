import React from 'react';
import { galleryData } from '@/data/gallery';
import { siteConfig } from '@/config/site';
import { MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Galeri & Portföy | Palm Stüdyo',
  description: 'Düğün, kına, nişan ve özel davet konsept çalışmalarımızdan öne çıkan kareler.',
};

export default function GalleryPage() {
  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <div style={{ backgroundColor: 'var(--palm-black)', color: 'var(--palm-cream)', minHeight: '100vh' }}>
      <section style={{ backgroundColor: 'var(--palm-deep-brown)', borderBottom: '1px solid var(--palm-border)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--palm-gold)', fontWeight: 700, marginBottom: '14px', display: 'block' }}>
            GALERİ & PORTFÖY
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#ffffff', marginBottom: '20px', lineHeight: 1.15 }}>
            Örnek Tasarım Konseptlerimiz
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: 'var(--palm-muted)', lineHeight: '1.7' }}>
            Siz de kendi etkinliğiniz için hayal ettiğiniz konsepti bize iletebilir, özel yerleşim ve çekim teklifi alabilirsiniz.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 24px', backgroundColor: 'var(--palm-black)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {galleryData.map((item) => (
              <div key={item.id} className="palm-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--palm-surface)', border: '1px solid var(--palm-border)' }}>
                <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', backgroundColor: 'rgba(13, 11, 9, 0.85)', color: 'var(--palm-gold)', border: '1px solid var(--palm-border)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                    Örnek Çalışma
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--palm-gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {item.categoryLabel}
                  </div>
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

          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold">
              <MessageCircle size={18} />
              <span>Kendi Konseptinizi Tasarlatın (WhatsApp)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
