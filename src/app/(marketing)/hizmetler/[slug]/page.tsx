import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import { siteConfig } from '@/config/site';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  HelpCircle,
  QrCode,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface ServiceDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailProps) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return { title: 'Hizmet Bulunamadı | Palm Stüdyo' };

  return {
    title: `${service.title} | Palm Stüdyo`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const whatsappLink = siteConfig.getWhatsAppLink(`Merhaba Palm Stüdyo, ${service.title} hizmetiniz hakkında detaylı bilgi ve teklif almak istiyorum.`);
  const otherServices = servicesData.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div style={{ color: '#1E2522' }}>
      {/* Hero Banner */}
      <section style={{ backgroundColor: '#183D35', color: '#F8F6F1', padding: '70px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Link href="/hizmetler" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#DCCDBD', fontSize: '0.85rem', marginBottom: '24px' }}>
            <ArrowLeft size={16} />
            <span>Tüm Hizmetlere Dön</span>
          </Link>

          <span className="palm-tag" style={{ backgroundColor: 'rgba(181, 154, 99, 0.2)', color: '#B59A63', marginBottom: '16px' }}>
            PALM STÜDYO HİZMET DETAYI
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 700, color: '#F8F6F1', marginBottom: '20px' }}>
            {service.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#DCCDBD', lineHeight: '1.7', maxWidth: '750px' }}>
            {service.shortDesc}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '90px 24px', backgroundColor: '#F8F6F1' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px' }}>
          
          {/* Main Description & Features */}
          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--palm-border)' }}>
              <img src={service.coverImage} alt={service.title} style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: '#183D35', marginBottom: '20px' }}>
              Hizmet İçeriği & Konsept Yaklaşımımız
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#4a5568', lineHeight: '1.8', marginBottom: '36px' }}>
              {service.fullDesc}
            </p>

            {/* Features Checklist */}
            <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '20px', border: '1px solid var(--palm-border)', marginBottom: '40px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#183D35', marginBottom: '20px' }}>
                Neler Sunuyoruz?
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {service.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CheckCircle2 size={20} style={{ color: '#557A67', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.95rem', color: '#1E2522', lineHeight: '1.5' }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            {service.processSteps && service.processSteps.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#183D35', marginBottom: '24px' }}>
                  Hizmet Sürecimiz
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {service.processSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: '#ffffff', border: '1px solid var(--palm-border)', borderRadius: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#183D35', color: '#F8F6F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#183D35' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#183D35', marginBottom: '24px' }}>
                  Sık Sorulan Sorular
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} style={{ padding: '24px', backgroundColor: '#ffffff', border: '1px solid var(--palm-border)', borderRadius: '16px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#183D35', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HelpCircle size={18} style={{ color: '#B59A63' }} />
                        <span>{faq.question}</span>
                      </h4>
                      <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6', paddingLeft: '26px' }}>
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
            <div style={{ position: 'sticky', top: '100px', backgroundColor: '#183D35', color: '#F8F6F1', padding: '36px', borderRadius: '24px', border: '1px solid rgba(181, 154, 99, 0.3)' }}>
              <Sparkles size={32} style={{ color: '#B59A63', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px', color: '#F8F6F1' }}>
                Teklif ve Tarih Bilgisi Alın
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#DCCDBD', lineHeight: '1.6', marginBottom: '28px' }}>
                {service.title} hizmetimiz için müsaitlik durumunu öğrenmek ve özel teklif almak için mesaj gönderin.
              </p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="palm-btn-gold" style={{ width: '100%', marginBottom: '16px' }}>
                <MessageCircle size={18} />
                <span>WhatsApp İle Ulaşın</span>
              </a>
              <Link href="/iletisim" className="palm-btn-secondary" style={{ width: '100%', color: '#F8F6F1', borderColor: 'rgba(248, 246, 241, 0.4)', textAlign: 'center' }}>
                <span>Teklif Formu Doldurun</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Related Services */}
      <section style={{ padding: '80px 24px', backgroundColor: '#EEE9E1' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#183D35', fontWeight: 700, marginBottom: '32px' }}>
            İlgili Diğer Hizmetlerimiz
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {otherServices.map((item) => (
              <div key={item.id} className="palm-card" style={{ padding: '24px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#183D35', fontWeight: 700, marginBottom: '8px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: '1.5', marginBottom: '16px' }}>
                  {item.shortDesc}
                </p>
                <Link href={`/hizmetler/${item.slug}`} style={{ fontSize: '0.85rem', fontWeight: 700, color: '#557A67', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
