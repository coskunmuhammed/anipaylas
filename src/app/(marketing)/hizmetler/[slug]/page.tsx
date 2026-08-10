import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import { siteConfig } from '@/config/site';
import { getServicesContent } from '@/services/siteContent.service';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  HelpCircle,
  QrCode,
  Layers,
  ArrowLeft,
  Camera
} from 'lucide-react';

interface ServiceDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailProps) {
  const { slug } = await params;
  const allServices = await getServicesContent();
  const service = allServices.find((s) => s.slug === slug) || servicesData.find((s) => s.slug === slug);
  if (!service) return { title: 'Hizmet Bulunamadı | Palm Studio' };

  return {
    title: `${service.title} | Palm Studio`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const { slug } = await params;
  const allServices = await getServicesContent();
  const service = allServices.find((s) => s.slug === slug) || servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const whatsappLink = siteConfig.getWhatsAppLink(`Merhaba Palm Studio, ${service.title} hizmetiniz hakkında detaylı bilgi ve teklif almak istiyorum.`);
  const otherServices = allServices.filter((s) => s.slug !== slug).slice(0, 3);
  const galleryPhotos = service.galleryPhotos && service.galleryPhotos.length > 0 
    ? service.galleryPhotos 
    : [service.coverImage];

  return (
    <div style={{ backgroundColor: 'var(--palm-black)', color: 'var(--palm-cream)', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <section style={{ backgroundColor: 'var(--palm-deep-brown)', borderBottom: '1px solid var(--palm-border)', padding: '70px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Back Button and Badge Container */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
            <Link 
              href="/hizmetler" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: 'var(--palm-gold)', 
                fontSize: '0.88rem', 
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
            >
              <ArrowLeft size={16} />
              <span>Tüm Hizmetlere Dön</span>
            </Link>

            <span className="palm-tag">
              PALM STUDIO HİZMET DETAYI
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 700, color: '#ffffff', marginBottom: '20px', lineHeight: 1.15 }}>
            {service.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', color: 'var(--palm-muted)', lineHeight: '1.7', maxWidth: '750px' }}>
            {service.shortDesc}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--palm-black)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px' }}>
          
          {/* Main Description & Features */}
          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--palm-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <img src={service.coverImage} alt={service.title} style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
              Hizmet İçeriği & Konsept Yaklaşımımız
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--palm-muted)', lineHeight: '1.8', marginBottom: '36px' }}>
              {service.fullDesc}
            </p>

            {/* Features Checklist */}
            <div style={{ backgroundColor: 'var(--palm-surface)', padding: '36px', borderRadius: '20px', border: '1px solid var(--palm-border)', marginBottom: '40px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--palm-gold)', marginBottom: '20px' }}>
                Neler Sunuyoruz?
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {service.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--palm-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#ffffff', lineHeight: '1.5' }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            {service.processSteps && service.processSteps.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#ffffff', marginBottom: '24px' }}>
                  Hizmet Sürecimiz
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {service.processSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: 'var(--palm-surface)', border: '1px solid var(--palm-border)', borderRadius: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--palm-gold)', color: '#0d0b09', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Gallery Photo Showcase Section (Right below Hizmet Sürecimiz as requested) */}
            {galleryPhotos.length > 0 && (
              <div style={{ marginBottom: '48px', backgroundColor: 'var(--palm-deep-brown)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(201, 170, 103, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Camera size={22} style={{ color: 'var(--palm-gold)' }} />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
                      Örnek Çalışmalarımız & Kareler
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--palm-gold)', fontWeight: 700, fontFamily: 'var(--font-sans)', backgroundColor: 'rgba(201, 170, 103, 0.12)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(201, 170, 103, 0.3)' }}>
                    {galleryPhotos.length} Kare
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {galleryPhotos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                        backgroundColor: '#16120e',
                        position: 'relative',
                        transition: 'transform 0.3s ease, border-color 0.3s ease',
                      }}
                    >
                      <img
                        src={photoUrl}
                        alt={`${service.title} Görseli ${idx + 1}`}
                        style={{
                          width: '100%',
                          maxHeight: '520px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '16px',
                          backgroundColor: 'rgba(13, 11, 9, 0.75)',
                          backdropFilter: 'blur(8px)',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.78rem',
                          color: 'var(--palm-gold-light)',
                          fontWeight: 600,
                          border: '1px solid rgba(201, 170, 103, 0.3)',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        Kare #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#ffffff', marginBottom: '24px' }}>
                  Sık Sorulan Sorular
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} style={{ padding: '24px', backgroundColor: 'var(--palm-surface)', border: '1px solid var(--palm-border)', borderRadius: '16px' }}>
                      <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--palm-gold-light)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HelpCircle size={18} style={{ color: 'var(--palm-gold)' }} />
                        <span>{faq.question}</span>
                      </h4>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--palm-muted)', lineHeight: '1.6', paddingLeft: '26px' }}>
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA Card */}
          <div>
            <div style={{ position: 'sticky', top: '100px', backgroundColor: 'var(--palm-deep-brown)', color: '#ffffff', padding: '36px', borderRadius: '24px', border: '1px solid rgba(201, 170, 103, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
              <Sparkles size={32} style={{ color: 'var(--palm-gold)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px', color: '#ffffff' }}>
                Teklif ve Tarih Bilgisi Alın
              </h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--palm-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
                {service.title} hizmetimiz için müsaitlik durumunu öğrenmek ve özel teklif almak için mesaj gönderin.
              </p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold" style={{ width: '100%', marginBottom: '16px', justifyContent: 'center' }}>
                <MessageCircle size={18} />
                <span>WhatsApp İle Ulaşın</span>
              </a>
              <Link href="/iletisim" className="palm-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Teklif Formu Doldurun</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Related Services */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--palm-deep-brown)', borderTop: '1px solid var(--palm-border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#ffffff', fontWeight: 700, marginBottom: '32px' }}>
            İlgili Diğer Hizmetlerimiz
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {otherServices.map((item) => (
              <div key={item.id} className="palm-card" style={{ padding: '28px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#ffffff', fontWeight: 700, marginBottom: '8px' }}>
                  {item.title}
                </h4>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--palm-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                  {item.shortDesc}
                </p>
                <Link href={`/hizmetler/${item.slug}`} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--palm-gold)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>İncele</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
