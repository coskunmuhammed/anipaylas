'use client';

import React from 'react';
import Link from 'next/link';
import { QrCode, Camera, ShieldCheck, Download, Lock, ArrowRight, Sparkles } from 'lucide-react';
import GoldButton from './GoldButton';

export default function DigitalMemoryShowcase() {
  return (
    <section
      id="dijital-ani-albumu"
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-deep-brown)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Glow Background */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(201, 170, 103, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Header Tag & Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              backgroundColor: 'rgba(201, 170, 103, 0.12)',
              border: '1px solid rgba(201, 170, 103, 0.25)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: 'var(--palm-gold-light)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            <QrCode size={14} />
            <span>PALM DİJİTAL HİZMETLER</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}
          >
            Palm Stüdyo{' '}
            <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>
              Dijital Anı Albümü
            </span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--palm-muted)',
              lineHeight: 1.7,
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            Düğün ve özel etkinliklerinizde misafirlerinizin cep telefonlarıyla çektiği tüm doğal ve samimi anları uygulama indirtmeden tek bir QR kodla yüksek kalitede toplayın.
          </p>
        </div>

        {/* 3 Step Workflow Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            marginBottom: '60px',
          }}
        >
          {/* Step 1 */}
          <div
            className="palm-card"
            style={{
              backgroundColor: 'var(--palm-surface)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              padding: '36px 28px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(201, 170, 103, 0.12)',
                border: '1px solid rgba(201, 170, 103, 0.3)',
                color: 'var(--palm-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <QrCode size={26} />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--palm-gold)', letterSpacing: '0.1em', marginBottom: '8px' }}>
              ADIM 1
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#ffffff', marginBottom: '12px', fontWeight: 600 }}>
              Masa QR Kodları
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--palm-muted)', lineHeight: 1.6 }}>
              Etkinlik alanındaki masalara ve girişe Palm Stüdyo kurumsal kimliğiyle tasarlanmış özel QR kodlar yerleştirilir.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className="palm-card"
            style={{
              backgroundColor: 'var(--palm-surface)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              padding: '36px 28px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(201, 170, 103, 0.12)',
                border: '1px solid rgba(201, 170, 103, 0.3)',
                color: 'var(--palm-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Camera size={26} />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--palm-gold)', letterSpacing: '0.1em', marginBottom: '8px' }}>
              ADIM 2
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#ffffff', marginBottom: '12px', fontWeight: 600 }}>
              Misafir Paylaşımı
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--palm-muted)', lineHeight: 1.6 }}>
              Misafirler kamera ile QR kodu okutur, uygulama yüklemeden etkinlik karşılama sayfasına girer ve çektikleri fotoğrafları yükler.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className="palm-card"
            style={{
              backgroundColor: 'var(--palm-surface)',
              borderColor: 'rgba(201, 170, 103, 0.3)',
              padding: '36px 28px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(201, 170, 103, 0.12)',
                border: '1px solid rgba(201, 170, 103, 0.3)',
                color: 'var(--palm-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Download size={26} />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--palm-gold)', letterSpacing: '0.1em', marginBottom: '8px' }}>
              ADIM 3
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#ffffff', marginBottom: '12px', fontWeight: 600 }}>
              Moderasyon & ZIP İndirme
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--palm-muted)', lineHeight: 1.6 }}>
              Yönetici panelinden fotoğraflar filtrelenir ve etkinlik bitiminde tüm anılar yüksek çözünürlüklü tek bir ZIP paketi olarak indirilir.
            </p>
          </div>
        </div>

        {/* Feature Highlight & Admin Quick Portal Frame */}
        <div
          style={{
            backgroundColor: '#1f1813',
            border: '1px solid rgba(201, 170, 103, 0.3)',
            borderRadius: '28px',
            padding: '48px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--palm-gold)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
              <Sparkles size={16} />
              <span>DİJİTAL ANI SİSTEMİ DAHİLDİR</span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
              Etkinlik Sahipleri ve Yönetici Paneli
            </h3>

            <p style={{ fontSize: '0.95rem', color: 'var(--palm-muted)', lineHeight: 1.6 }}>
              Palm Stüdyo panelinden yeni etkinlik oluşturabilir, QR kod basım çıktıları alabilir, moderasyonu yönetebilir ve indirme bağlantılarını kontrol edebilirsiniz.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <GoldButton href="/hizmetler/dijital-ani-albumu" variant="gold">
              <span>Hizmet Detayları</span>
              <ArrowRight size={16} />
            </GoldButton>

            <GoldButton href="/admin" variant="secondary">
              <Lock size={16} style={{ color: 'var(--palm-gold)' }} />
              <span>Yönetici & Admin Girişi</span>
            </GoldButton>
          </div>
        </div>

      </div>
    </section>
  );
}
