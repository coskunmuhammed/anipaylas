import React from 'react';
import { siteConfig } from '@/config/site';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { MessageCircle, Mail, MapPin, Sparkles, Send } from 'lucide-react';

export const metadata = {
  title: 'İletişim & Teklif | Palm Stüdyo',
  description: 'Düğün, kına, nişan ve dijital anı albümü hizmetlerimiz için Palm Stüdyo ile iletişime geçin.',
};

export default function ContactPage() {
  const whatsappLink = siteConfig.getWhatsAppLink('Merhaba Palm Stüdyo, yaklaşan etkinliğimiz için organizasyon ve çekim teklifi almak istiyorum.');

  return (
    <div style={{ backgroundColor: 'var(--palm-black)', color: 'var(--palm-cream)', minHeight: '100vh' }}>
      <section style={{ backgroundColor: 'var(--palm-deep-brown)', borderBottom: '1px solid var(--palm-border)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--palm-gold)', fontWeight: 700, marginBottom: '14px', display: 'block' }}>
            BİZE ULAŞIN
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#ffffff', marginBottom: '20px', lineHeight: 1.15 }}>
            Etkinliğinizi Birlikte Tasarlayalım
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: 'var(--palm-muted)', lineHeight: '1.7' }}>
            Teklif talepleriniz, tarih müsaitlikleri ve dijital anı albümü detayları için bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 24px', backgroundColor: 'var(--palm-black)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          
          {/* Contact Details Card */}
          <div className="palm-card" style={{ backgroundColor: 'var(--palm-surface)', border: '1px solid var(--palm-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#ffffff', fontWeight: 700, marginBottom: '24px' }}>
              İletişim Kanallarımız
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>WhatsApp İletişim Hattı</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--palm-muted)', marginBottom: '8px' }}>Hızlı bilgi ve anında teklif için mesaj atın.</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--palm-gold)', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-sans)' }}>
                    WhatsApp Mesajı Gönder &rarr;
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(201, 170, 103, 0.12)', color: 'var(--palm-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <InstagramIcon size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Instagram Hesabımız</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--palm-muted)', marginBottom: '8px' }}>Güncel konsept ve hikayelerimizi takip edin.</p>
                  <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--palm-gold)', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-sans)' }}>
                    @{siteConfig.instagramUsername} &rarr;
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(201, 170, 103, 0.12)', color: 'var(--palm-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>E-Posta</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--palm-muted)' }}>{siteConfig.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(201, 170, 103, 0.12)', color: 'var(--palm-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Merkez Stüdyo & Hizmet Bölgesi</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--palm-muted)' }}>Didim / Aydın merkezli stüdyomuzdan Türkiye'nin 81 iline ve yurt dışına özel çekim & organizasyon hizmeti vermekteyiz.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Action Card */}
          <div className="palm-card" style={{ backgroundColor: 'var(--palm-deep-brown)', color: '#ffffff', border: '1px solid var(--palm-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
              En Hızlı İletişim Yolu
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--palm-muted)', lineHeight: '1.7', marginBottom: '36px' }}>
              Form beklemek yerine etkinlik tarihiniz, kişi sayınız ve çekim konseptiniz ile WhatsApp hattımızdan direkt iletişime geçebilirsiniz.
            </p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              <MessageCircle size={20} />
              <span>WhatsApp İle Doğrudan İletişim</span>
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
