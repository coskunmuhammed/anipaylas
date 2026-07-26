import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { servicesData } from '@/data/services';
import { galleryData } from '@/data/gallery';
import { packagesData } from '@/data/packages';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { 
  Sparkles, 
  QrCode, 
  Camera, 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2, 
  Star,
  Layers,
  HeartHandshake
} from 'lucide-react';

export const metadata = {
  title: 'Palm Stüdyo | Düğün, Kına, Nişan ve Özel Etkinlik Organizasyonu',
  description: 'Palm Stüdyo ile düğün, kına, nişan ve özel etkinliklerinizi profesyonel organizasyon, dekorasyon ve dijital anı albümü hizmetleriyle unutulmaz hale getirin.',
};

export default function MarketingHomePage() {
  const whatsappLink = siteConfig.getWhatsAppLink();

  return (
    <div style={{ color: '#1E2522' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '100px 24px 120px 24px',
          backgroundColor: '#183D35',
          color: '#F8F6F1',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(181, 154, 99, 0.15) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(85, 122, 103, 0.2) 0%, transparent 50%)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '30px', border: '1px solid rgba(181, 154, 99, 0.3)', marginBottom: '28px' }}>
              <Sparkles size={16} style={{ color: '#B59A63' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', color: '#DCCDBD' }}>PALM STÜDYO PREMİUM ETKİNLİK TASARIMI</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '24px', color: '#F8F6F1' }}>
              Hayalinizdeki günü <br />
              <span style={{ color: '#B59A63', fontStyle: 'italic' }}>birlikte tasarlıyoruz.</span>
            </h1>

            <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#DCCDBD', maxWidth: '580px', marginBottom: '40px', fontWeight: 400 }}>
              Düğün, kına, nişan ve özel davetlerinizi; tasarım, organizasyon ve dijital anı deneyimleriyle unutulmaz hale getiriyoruz.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link href="/hizmetler" className="palm-btn-gold">
                <span>Hizmetlerimizi İncele</span>
                <ArrowRight size={18} />
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-secondary" style={{ color: '#F8F6F1', borderColor: 'rgba(248, 246, 241, 0.4)' }}>
                <MessageCircle size={18} />
                <span>Teklif Al</span>
              </a>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(181, 154, 99, 0.3)', boxShadow: '0 24px 48px rgba(0,0,0,0.3)', position: 'relative', height: '480px' }}>
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                alt="Palm Stüdyo Düğün Tasarımı"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(24, 61, 53, 0.85) 0%, transparent 60%)' }} />
              
              <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px' }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B59A63', fontWeight: 700, marginBottom: '6px' }}>
                  Örnek Tasarım Konsepti
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, color: '#F8F6F1' }}>
                  Açık Hava Kır Düğünü Süsleme & Masa Düzeni
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRO SECTION */}
      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span className="palm-tag" style={{ marginBottom: '16px' }}>Biz Kimiz</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: '#183D35', marginBottom: '24px' }}>
            Palm Stüdyo Deneyimi
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#4a5568', fontWeight: 400 }}>
            Her etkinliğin kendine özgü bir hikâyesi olduğuna inanıyoruz. Tasarımdan uygulamaya, mekân düzeninden dijital anı albümüne kadar tüm detayları tek bir yaratıcı çatı altında planlıyoruz.
          </p>
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section style={{ padding: '90px 24px', backgroundColor: '#EEE9E1' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="palm-tag" style={{ marginBottom: '16px' }}>Uzmanlık Alanlarımız</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: '#183D35' }}>
              Etkinlik & Organizasyon Hizmetlerimiz
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {servicesData.map((service) => (
              <div key={service.id} className="palm-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img src={service.coverImage} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px 14px', backgroundColor: 'rgba(24, 61, 53, 0.85)', color: '#F8F6F1', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                    Palm Stüdyo
                  </div>
                </div>
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: '#183D35', marginBottom: '12px' }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                    {service.shortDesc}
                  </p>
                  <Link href={`/hizmetler/${service.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#183D35', fontWeight: 700, fontSize: '0.9rem' }}>
                    <span>Detayları Gör</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DIGITAL MEMORY ALBUM SECTION (PALM ANILAR) */}
      <section style={{ padding: '100px 24px', backgroundColor: '#183D35', color: '#F8F6F1' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: 'rgba(181, 154, 99, 0.15)', color: '#B59A63', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px' }}>
              <QrCode size={16} />
              <span>DİJİTAL ETKİNLİK MODÜLÜ</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#F8F6F1', marginBottom: '24px', lineHeight: 1.2 }}>
              Misafirlerinizin gözünden <br />
              <span style={{ color: '#B59A63' }}>tüm anılar tek albümde.</span>
            </h2>

            <p style={{ fontSize: '1.1rem', color: '#DCCDBD', lineHeight: '1.7', marginBottom: '36px' }}>
              Etkinliğinize özel hazırladığımız QR kodu masalara ve giriş alanına yerleştiriyoruz. Misafirleriniz hiçbir uygulama indirmeden çektikleri eşsiz fotoğrafları dijital albümünüze yüklüyor.
            </p>

            {/* Step list */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#B59A63', fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>1. QR Kodu Okut</div>
                <div style={{ fontSize: '0.85rem', color: '#DCCDBD' }}>Kamera ile anında tara</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#B59A63', fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>2. Sayfayı Aç</div>
                <div style={{ fontSize: '0.85rem', color: '#DCCDBD' }}>Palm Stüdyo karşılama ekranı</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#B59A63', fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>3. Fotoğrafı Seç</div>
                <div style={{ fontSize: '0.85rem', color: '#DCCDBD' }}>Galeriden veya anlık çek</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#B59A63', fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>4. Albüme Ekle</div>
                <div style={{ fontSize: '0.85rem', color: '#DCCDBD' }}>Güvenli moderasyonlu kayıt</div>
              </div>
            </div>

            <Link href="/hizmetler/dijital-ani-albumu" className="palm-btn-gold">
              <span>Dijital Anı Albümünü Keşfet</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(181, 154, 99, 0.2)', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(181, 154, 99, 0.15)', color: '#B59A63', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <QrCode size={40} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#F8F6F1', marginBottom: '12px' }}>
              Palm Stüdyo Dijital Anı Albümü
            </h3>
            <p style={{ color: '#DCCDBD', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
              Uygulama indirmeye gerek olmadan, yüksek çözünürlüklü toplu ZIP indirme ve moderasyon kontrolü sunan dijital anı modülü.
            </p>
            <div style={{ padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', fontSize: '0.85rem', color: '#B59A63' }}>
              Örnek QR Kod Sunum Formatı
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW WE WORK */}
      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="palm-tag" style={{ marginBottom: '16px' }}>Süreç</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: '#183D35' }}>
              Nasıl Çalışıyoruz?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', title: 'İhtiyacınızı Dinliyoruz', desc: 'Hayallerinizi, tarzınızı ve etkinliğinizin detaylarını detaylıca konuşuyoruz.' },
              { step: '02', title: 'Konsepti Tasarlıyoruz', desc: 'Renk paleti, çiçek düzenlemeleri ve mekan yerleşim planını hazırlıyoruz.' },
              { step: '03', title: 'Organizasyonu Planlıyoruz', desc: 'Ses, ışık, aksesuar ve dijital anı albümü kurulumlarını koordine ediyoruz.' },
              { step: '04', title: 'Etkinlik Gününü Yönetiyoruz', desc: 'Etkinlik günü tüm akışı saha koordinatörlerimizle canlı yönetiyoruz.' },
              { step: '05', title: 'Anıları Teslim Ediyoruz', desc: 'Dijital anı albümünüzdeki fotoğrafları onaylayıp yüksek kalitede sunuyoruz.' },
            ].map((item) => (
              <div key={item.step} className="palm-card" style={{ padding: '28px' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#B59A63', marginBottom: '12px' }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#183D35', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: '1.5' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PORTFOLIO / GALLERY PREVIEW */}
      <section style={{ padding: '90px 24px', backgroundColor: '#EEE9E1' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="palm-tag" style={{ marginBottom: '16px' }}>Portföy</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: '#183D35' }}>
                Örnek Çalışmalarımız
              </h2>
            </div>
            <Link href="/galeri" className="palm-btn-secondary">
              <span>Tüm Portföyü Gör</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {galleryData.slice(0, 3).map((item) => (
              <div key={item.id} className="palm-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', backgroundColor: 'rgba(248, 246, 241, 0.9)', color: '#183D35', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Örnek Çalışma
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#557A67', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {item.categoryLabel}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#183D35', fontWeight: 700 }}>
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PACKAGES SCOPE SECTION */}
      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="palm-tag" style={{ marginBottom: '16px' }}>Paket Seçenekleri</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: '#183D35', marginBottom: '12px' }}>
              İhtiyacınıza Uygun Kapsamlar
            </h2>
            <p style={{ color: '#4a5568', fontSize: '1rem' }}>
              Fiyatlarımız etkinlik tarihi, kişi sayısı ve mekan detaylarına göre özel teklif olarak sunulmaktadır.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {packagesData.map((pkg) => (
              <div
                key={pkg.id}
                className="palm-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: pkg.isPopular ? '2px solid #B59A63' : '1px solid var(--palm-border)',
                  position: 'relative',
                }}
              >
                {pkg.badge && (
                  <div style={{ position: 'absolute', top: '-14px', right: '24px', padding: '4px 16px', backgroundColor: '#B59A63', color: '#ffffff', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {pkg.badge}
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: '#183D35', marginBottom: '8px' }}>
                  {pkg.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#557A67', fontWeight: 600, marginBottom: '20px' }}>
                  {pkg.tagline}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6', marginBottom: '28px' }}>
                  {pkg.description}
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px', flex: 1 }}>
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#1E2522' }}>
                      <CheckCircle2 size={18} style={{ color: '#557A67', flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={pkg.isPopular ? 'palm-btn-gold' : 'palm-btn-primary'} style={{ width: '100%' }}>
                  <MessageCircle size={18} />
                  <span>Teklif Al</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM AREA */}
      <section style={{ padding: '80px 24px', backgroundColor: '#EEE9E1', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#183D35', marginBottom: '12px' }}>
            <InstagramIcon size={24} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Palm Stüdyo Kurumsal Instagram</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: '#183D35', marginBottom: '28px' }}>
            @{siteConfig.instagramUsername}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {galleryData.slice(0, 4).map((item, idx) => (
              <div key={idx} style={{ height: '180px', borderRadius: '16px', overflow: 'hidden' }}>
                <img src={item.imageUrl} alt="Palm Stüdyo Instagram Paylaşımı" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="palm-btn-secondary">
            <InstagramIcon size={18} />
            <span>Instagram'da Takip Et</span>
          </a>
        </div>
      </section>

      {/* 9. CONTACT CTA */}
      <section style={{ padding: '100px 24px', backgroundColor: '#183D35', color: '#F8F6F1', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 700, marginBottom: '20px', color: '#F8F6F1' }}>
            Hayalinizdeki etkinliği <br />
            <span style={{ color: '#B59A63', fontStyle: 'italic' }}>birlikte planlayalım.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#DCCDBD', lineHeight: '1.7', marginBottom: '40px' }}>
            Tarihinizi ayırtmak, özel tasarım konsept teklifi almak ve dijital anı albümü detaylarını öğrenmek için bizimle iletişime geçin.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold">
              <MessageCircle size={18} />
              <span>WhatsApp'tan Yazın</span>
            </a>
            <Link href="/iletisim" className="palm-btn-secondary" style={{ color: '#F8F6F1', borderColor: 'rgba(248, 246, 241, 0.4)' }}>
              <span>Teklif Formu</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
