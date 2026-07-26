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
    <div style={{ color: '#1E2522' }}>
      <section style={{ backgroundColor: '#183D35', color: '#F8F6F1', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B59A63', fontWeight: 700, marginBottom: '12px', display: 'block' }}>
            GALERİ & PORTFÖY
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#F8F6F1', marginBottom: '20px' }}>
            Örnek Tasarım Konseptlerimiz
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#DCCDBD', lineHeight: '1.7' }}>
            Siz de kendi etkinliğiniz için hayal ettiğiniz konsepti bize iletebilir, özel 3D yerleşim ve süsleme teklifi alabilirsiniz.
          </p>
        </div>
      </section>

      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {galleryData.map((item) => (
              <div key={item.id} className="palm-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', backgroundColor: 'rgba(248, 246, 241, 0.95)', color: '#183D35', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Örnek Çalışma
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#557A67', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {item.categoryLabel}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#183D35', fontWeight: 700, marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: '1.5' }}>
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
