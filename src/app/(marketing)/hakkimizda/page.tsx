import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Sparkles, Award, Heart, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Hakkımızda | Palm Stüdyo - Etkinlik & Tasarım',
  description: 'Palm Stüdyo; düğün, kına, nişan ve özel organizasyonlarınızda mimari tasarım, mekan süsleme ve dijital anı çözümleri sunar.',
};

export default function AboutPage() {
  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <div style={{ color: '#1E2522' }}>
      {/* Header Banner */}
      <section style={{ backgroundColor: '#183D35', color: '#F8F6F1', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B59A63', fontWeight: 700, marginBottom: '12px', display: 'block' }}>
            HİKAYEMİZ & VİZYONUMUZ
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#F8F6F1', marginBottom: '20px' }}>
            Unutulmaz Anlara Zarafet Katıyoruz
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#DCCDBD', lineHeight: '1.7' }}>
            Palm Stüdyo, lüks mekan tasarımı, kusursuz organizasyon yönetimi ve yenilikçi dijital anı teknolojilerini tek bir profesyonel çatı altında birleştirir.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <span className="palm-tag" style={{ marginBottom: '16px' }}>Felsefemiz</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#183D35', marginBottom: '24px' }}>
              Her Detayda Estetik, Her Anıda Mutluluk
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#4a5568', lineHeight: '1.8', marginBottom: '20px' }}>
              Etkinlikler sadece bir araya gelmek değil, ömür boyu hatırlanacak anıların inşa edildiği özel zamanlardır. Palm Stüdyo olarak, şablon tasarımlar yerine çiftlerimizin ve ev sahiplerimizin kişisel tarzını yansıtan konseptler geliştiriyoruz.
            </p>
            <p style={{ fontSize: '1.05rem', color: '#4a5568', lineHeight: '1.8', marginBottom: '32px' }}>
              Mekanın ilk keşiyle başlayan sürecimiz; çiçek düzenlemeleri, ışık şovları, masa konseptleri ve misafirlerinizin çektikleri fotoğrafları toplayan "Palm Anılar" dijital albümüyle taçlanır.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid var(--palm-border)', borderRadius: '16px' }}>
                <Award size={28} style={{ color: '#B59A63', marginBottom: '8px' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#183D35', marginBottom: '4px' }}>Lüks Konsept</h3>
                <p style={{ fontSize: '0.85rem', color: '#4a5568' }}>Kişiye özel mekan & dekor mimarisi</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid var(--palm-border)', borderRadius: '16px' }}>
                <ShieldCheck size={28} style={{ color: '#557A67', marginBottom: '8px' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#183D35', marginBottom: '4px' }}>Dijital Teknoloji</h3>
                <p style={{ fontSize: '0.85rem', color: '#4a5568' }}>Uygulamasız QR anı platformu</p>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--palm-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80" alt="Palm Stüdyo Ekibi ve Tasarımı" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', backgroundColor: '#EEE9E1', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: '#183D35', fontWeight: 700, marginBottom: '20px' }}>
            Etkinliğinizi Birlikte Tasarlayalım
          </h2>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold">
            <MessageCircle size={18} />
            <span>Bizimle İletişime Geçin</span>
          </a>
        </div>
      </section>
    </div>
  );
}
