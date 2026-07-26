import React from 'react';
import { siteConfig } from '@/config/site';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { MessageCircle, Mail, MapPin, Sparkles, Send } from 'lucide-react';

export const metadata = {
  title: 'İletişim & Teklif | Palm Stüdyo',
  description: 'Düğün, kına, nişan ve dijital anı albümü hizmetlerimiz için Palm Stüdyo ile iletişime geçin.',
};

export default function ContactPage() {
  const whatsappLink = siteConfig.getWhatsAppLink('Merhaba Palm Stüdyo, yaklaşan etkinliğimiz için organizasyon teklifi almak istiyorum.');

  return (
    <div style={{ color: '#1E2522' }}>
      <section style={{ backgroundColor: '#183D35', color: '#F8F6F1', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B59A63', fontWeight: 700, marginBottom: '12px', display: 'block' }}>
            BİZE ULAŞIN
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 700, color: '#F8F6F1', marginBottom: '20px' }}>
            Etkinliğinizi Birlikte Tasarlayalım
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#DCCDBD', lineHeight: '1.7' }}>
            Teklif talepleriniz, tarih müsaitlikleri ve dijital anı albümü detayları için bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </section>

      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          
          {/* Contact Details Card */}
          <div className="palm-card" style={{ backgroundColor: '#ffffff' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#183D35', fontWeight: 700, marginBottom: '24px' }}>
              İletişim Kanallarımız
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(37, 211, 102, 0.1)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#183D35', marginBottom: '4px' }}>WhatsApp İletişim Hattı</h3>
                  <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '8px' }}>Hızlı bilgi ve anında teklif için mesaj atın.</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#557A67', fontWeight: 700, fontSize: '0.95rem' }}>
                    WhatsApp Mesajı Gönder &rarr;
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(24, 61, 53, 0.08)', color: '#183D35', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <InstagramIcon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#183D35', marginBottom: '4px' }}>Instagram Hesabımız</h3>
                  <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '8px' }}>Güncel konsept ve hikayelerimizi takip edin.</p>
                  <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#557A67', fontWeight: 700, fontSize: '0.95rem' }}>
                    @{siteConfig.instagramUsername} &rarr;
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(181, 154, 99, 0.12)', color: '#B59A63', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#183D35', marginBottom: '4px' }}>E-Posta</h3>
                  <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>{siteConfig.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(24, 61, 53, 0.08)', color: '#183D35', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#183D35', marginBottom: '4px' }}>Hizmet Bölgesi</h3>
                  <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>İstanbul ve çevre illerde lüks organizasyon hizmeti vermekteyiz.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Action Card */}
          <div className="palm-card" style={{ backgroundColor: '#183D35', color: '#F8F6F1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Sparkles size={36} style={{ color: '#B59A63', marginBottom: '20px' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: '#F8F6F1', marginBottom: '16px' }}>
              En Hızlı İletişim Yolu
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#DCCDBD', lineHeight: '1.7', marginBottom: '36px' }}>
              Form beklemek yerine etkinlik tarihiniz, kişi sayınız ve yer bilgisi ile WhatsApp hattımızdan direkt iletişime geçebilirsiniz.
            </p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold" style={{ width: '100%' }}>
              <MessageCircle size={20} />
              <span>WhatsApp İle Doğrudan İletişim</span>
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
