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
    <div style={{ backgroundColor: 'var(--palm-black)', color: 'var(--palm-cream)', minHeight: '100vh' }}>
      {/* Header Banner */}
      <section style={{ backgroundColor: 'var(--palm-deep-brown)', borderBottom: '1px solid var(--palm-border)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--palm-gold)', fontWeight: 700, marginBottom: '14px', display: 'block' }}>
            HİKAYEMİZ & VİZYONUMUZ
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#ffffff', marginBottom: '20px', lineHeight: 1.15 }}>
            Unutulmaz Anlara Zarafet Katıyoruz
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: 'var(--palm-muted)', lineHeight: '1.7' }}>
            Palm Stüdyo, lüks mekan tasarımı, kusursuz organizasyon yönetimi ve yenilikçi dijital anı teknolojilerini tek bir profesyonel çatı altında birleştirir.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--palm-black)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <span className="palm-tag" style={{ marginBottom: '16px' }}>Felsefemiz</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '24px' }}>
              Her Detayda Estetik, Her Anıda Mutluluk
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--palm-muted)', lineHeight: '1.8', marginBottom: '20px' }}>
              Etkinlikler sadece bir araya gelmek değil, ömür boyu hatırlanacak anıların inşa edildiği özel zamanlardır. Palm Stüdyo olarak, şablon tasarımlar yerine çiftlerimizin kişisel tarzını yansıtan konseptler geliştiriyoruz.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--palm-muted)', lineHeight: '1.8', marginBottom: '32px' }}>
              Mekanın ilk keşfiyle başlayan sürecimiz; çekimler, konsept organizasyonu ve misafirlerinizin çektikleri fotoğrafları toplayan dijital anı albümüyle taçlanır.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: 'var(--palm-surface)', border: '1px solid var(--palm-border)', borderRadius: '16px' }}>
                <Award size={28} style={{ color: 'var(--palm-gold)', marginBottom: '8px' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Lüks Konsept</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--palm-muted)' }}>Kişiye özel mekan & dekor mimarisi</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'var(--palm-surface)', border: '1px solid var(--palm-border)', borderRadius: '16px' }}>
                <ShieldCheck size={28} style={{ color: 'var(--palm-gold-light)', marginBottom: '8px' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Dijital Teknoloji</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--palm-muted)' }}>Uygulamasız QR anı platformu</p>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--palm-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <img 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200" 
              alt="Palm Stüdyo Ekibi" 
              style={{ width: '100%', height: '440px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '70px 24px', backgroundColor: 'var(--palm-deep-brown)', borderTop: '1px solid var(--palm-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#ffffff', fontWeight: 700, marginBottom: '16px' }}>
            Etkinliğinizi Birlikte Tasarlayalım
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--palm-muted)', marginBottom: '28px' }}>
            Tarihinizin uygunluğunu kontrol etmek ve özel konsept teklifinizi almak için bizimle iletişime geçin.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold">
              <MessageCircle size={18} />
              <span>WhatsApp İle İletişime Geçin</span>
            </a>
            <Link href="/iletisim" className="palm-btn-secondary">
              <span>İletişim Sayfası</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
