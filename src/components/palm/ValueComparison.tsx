'use client';

import React from 'react';

export default function ValueComparison() {
  return (
    <section
      style={{
        padding: '100px 24px 120px 24px',
        backgroundColor: 'var(--palm-deep-brown)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
            AYNI BÜTÇE, FARKLI ÖMÜR
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Hangisi{' '}
            <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>
              kalır?
            </span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--palm-muted)',
              lineHeight: 1.7,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Harcamalarınızı yargılamıyoruz — hepsi güzel bir günün parçası. Sadece hangisinin sizinle kaldığını gösteriyoruz.
          </p>
        </div>

        {/* 2 Symmetric Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            marginBottom: '60px',
          }}
        >
          {/* Card 1: Bir Gün */}
          <div
            className="palm-card"
            style={{
              backgroundColor: '#241c16',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--palm-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              BİR GÜN
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '28px' }}>
              Yaşanır ve geçer
            </h3>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
              {['Salon, ışıklar, sahne', 'Yemek, ikram', 'Çiçek, süsleme', 'Orkestra, müzik'].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--palm-muted)', fontSize: '1.2rem' }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--palm-muted)' }}>
              Ertesi sabah: bir anı, bir de fatura.
            </div>
          </div>

          {/* Card 2: Bir Ömür */}
          <div
            className="palm-card"
            style={{
              backgroundColor: '#2a211a',
              borderColor: 'rgba(201, 170, 103, 0.3)',
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
              BİR ÖMÜR
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '28px' }}>
              Kalır ve <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>değerlenir</span>
            </h3>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
              {['Fotoğraflanmış anlar', 'Sinematik filminiz', 'Her özel gününüzde açılan albüm', 'Torunlarınıza göstereceğiniz kareler'].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>
                  <span style={{ color: 'var(--palm-gold)', fontSize: '1.2rem' }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid rgba(201, 170, 103, 0.2)', paddingTop: '20px', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--palm-gold-light)' }}>
              On yıl sonra: hâlâ yanınızda, daha da değerli.
            </div>
          </div>
        </div>

        {/* Bottom Motto Banner */}
        <div style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#ffffff', fontWeight: 400 }}>
            En pahalı kare, <strong style={{ color: 'var(--palm-gold)', fontWeight: 600 }}>hiç çekilmemiş olandır.</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
