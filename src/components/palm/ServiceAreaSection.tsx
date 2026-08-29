'use client';

import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2 } from 'lucide-react';

export interface ServiceCity {
  id: string;
  name: string;
  label: string;
  x: number;
  y: number;
  isHub?: boolean;
}

// 1 Didim Hub + 9 Destination Cities matching the screenshot exactly
const SERVICE_CITIES: ServiceCity[] = [
  { id: 'didim', name: 'Didim', label: '📍 Didim Merkez', x: 100, y: 350, isHub: true },
  { id: 'izmir', name: 'İzmir', label: 'İzmir', x: 105, y: 282 },
  { id: 'bursa', name: 'Bursa', label: 'Bursa', x: 228, y: 172 },
  { id: 'istanbul', name: 'İstanbul', label: 'İstanbul', x: 208, y: 118 },
  { id: 'ankara', name: 'Ankara', label: 'Ankara', x: 405, y: 198 },
  { id: 'samsun', name: 'Samsun', label: 'Samsun', x: 570, y: 108 },
  { id: 'erzurum', name: 'Erzurum', label: 'Erzurum', x: 820, y: 192 },
  { id: 'diyarbakir', name: 'Diyarbakır', label: 'Diyarbakır', x: 780, y: 318 },
  { id: 'adana', name: 'Adana', label: 'Adana', x: 535, y: 378 },
  { id: 'antalya', name: 'Antalya', label: 'Antalya', x: 305, y: 392 },
];

const DIDIM_HUB = SERVICE_CITIES[0];
const DESTINATION_CITIES = SERVICE_CITIES.slice(1);

export default function ServiceAreaSection() {
  const [activeCityId, setActiveCityId] = useState<string | null>(null);
  const [cmsData, setCmsData] = useState({
    eyebrow: 'NEREDEN GELİYORLAR?',
    title: 'Didim’deyiz, hikâyeleriniz Türkiye’nin 81 ilinden geliyor.',
    description: 'Didim merkezimizden Türkiye’nin 81 iline ışınlanan anılar ve yurt dışından gelen çiftlerimiz için çekim, konsept ve organizasyon süreçlerini tek çatı altında planlıyoruz.',
    studioGuaranteeTitle: 'Tüm çekimler ve organizasyon detayları merkezimiz koordinasyonunda yönetilir.',
    studioGuaranteeText: 'Türkiye’nin 81 ilinden veya yurt dışından gelen tüm çiftlerimiz için Didim merkezimizde çekim, gelinlik, saç & makyaj, konaklama ve ulaşım planlamasını tek güne sığdırarak stresi sıfıra indiriyoruz.',
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content/homepage');
        const json = await res.json();
        if (json.success && json.data?.serviceArea) {
          setCmsData(json.data.serviceArea);
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

  return (
    <section
      style={{
        padding: '90px 20px 110px 20px',
        backgroundColor: 'var(--palm-deep-brown, #0d0b09)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '880px',
          height: '540px',
          background: 'radial-gradient(circle, rgba(201, 170, 103, 0.09) 0%, transparent 70%)',
          filter: 'blur(95px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Eyebrow & Title */}
        <div 
          style={{ 
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem', 
            fontWeight: 700, 
            letterSpacing: '0.2em', 
            color: 'var(--palm-gold, #c9aa67)', 
            textTransform: 'uppercase', 
            marginBottom: '14px' 
          }}
        >
          {cmsData.eyebrow}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)',
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}
        >
          {cmsData.title}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
            color: 'var(--palm-muted, #a39585)',
            lineHeight: 1.7,
            maxWidth: '740px',
            margin: '0 auto 40px auto',
          }}
        >
          {cmsData.description}
        </p>

        {/* 3D Realistic Turkey Map Card Container (Identical to Target Screenshot) */}
        <div
          style={{
            backgroundColor: '#130e0a',
            border: '1px solid rgba(216, 180, 92, 0.28)',
            borderRadius: '24px',
            padding: '24px 16px 28px 16px',
            maxWidth: '1100px',
            margin: '0 auto 40px auto',
            position: 'relative',
            boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Top Bar Legend (Matching target screenshot top right) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 12px 16px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '0.82rem', color: 'var(--palm-muted, #a39585)', fontFamily: 'var(--font-sans)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ffd700', boxShadow: '0 0 10px #ffd700' }} />
                <strong style={{ color: '#ffffff' }}>Didim Merkez</strong>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c9aa67' }} />
                81 İl Çekim Hizmeti
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div style={{ position: 'relative', width: '100%', height: 'auto', aspectRatio: '1000 / 500' }}>
            <svg
              viewBox="0 0 1000 500"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <defs>
                {/* 3D Realistic Land Surface Gradient */}
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2c2014" />
                  <stop offset="45%" stopColor="#4a3721" />
                  <stop offset="100%" stopColor="#694e2e" />
                </linearGradient>

                {/* Land Border Stroke Gradient */}
                <linearGradient id="landBorderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c9aa67" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#ffe4a0" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#b59146" stopOpacity="0.85" />
                </linearGradient>

                {/* Glowing Arc Line Gradient */}
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
                  <stop offset="70%" stopColor="#e1ba6d" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#9e7e42" stopOpacity="0.35" />
                </linearGradient>

                {/* Map Drop Shadow */}
                <filter id="mapShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000000" floodOpacity="0.95" />
                </filter>

                {/* Node Radial Glow */}
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Sea Grid */}
              <pattern id="seaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201, 170, 103, 0.025)" strokeWidth="0.8" />
              </pattern>
              <rect width="1000" height="500" fill="url(#seaGrid)" />

              {/* High-Precision 3D Extrusion Shadow Layer (3D relief bottom edge) */}
              <path
                d="M 125,75 L 135,60 L 155,62 L 170,72 L 180,82 L 195,85 L 205,100 L 210,110 L 218,102 L 225,108 L 235,115 L 245,112 L 255,105 L 270,105 L 285,108 L 310,106 L 335,105 L 360,102 L 385,98 L 410,95 L 435,92 L 460,88 L 480,85 L 495,65 L 508,68 L 520,78 L 535,85 L 555,92 L 575,98 L 595,104 L 620,112 L 645,118 L 670,122 L 695,120 L 720,118 L 745,116 L 770,114 L 795,112 L 815,112 L 830,118 L 845,130 L 855,145 L 870,152 L 885,155 L 905,158 L 925,165 L 940,178 L 948,195 L 952,215 L 954,235 L 950,255 L 945,275 L 938,295 L 928,315 L 915,335 L 898,355 L 885,372 L 870,390 L 858,405 L 842,415 L 825,410 L 805,405 L 785,408 L 760,412 L 735,410 L 710,412 L 685,415 L 660,415 L 635,412 L 610,408 L 590,405 L 575,410 L 560,422 L 550,438 L 542,455 L 538,470 L 532,455 L 525,438 L 520,422 L 512,408 L 495,402 L 475,408 L 455,420 L 438,430 L 420,438 L 400,440 L 380,438 L 360,432 L 342,422 L 325,415 L 305,410 L 285,408 L 265,412 L 245,418 L 225,425 L 205,428 L 185,425 L 165,418 L 148,410 L 132,402 L 118,395 L 105,388 L 95,378 L 88,368 L 98,358 L 105,350 L 98,342 L 88,335 L 80,325 L 72,312 L 80,300 L 92,290 L 85,280 L 75,270 L 68,258 L 60,248 L 70,238 L 82,228 L 75,218 L 68,208 L 75,198 L 85,188 L 78,175 L 68,162 L 78,150 L 88,138 L 78,125 L 68,112 L 78,98 L 88,85 L 102,75 L 115,68 Z"
                transform="translate(0, 8)"
                fill="#120c07"
                stroke="#281a0e"
                strokeWidth="2"
              />

              {/* Main Detailed Turkey Silhouette Path (Matching exact reference screenshot) */}
              <path
                d="M 125,75 L 135,60 L 155,62 L 170,72 L 180,82 L 195,85 L 205,100 L 210,110 L 218,102 L 225,108 L 235,115 L 245,112 L 255,105 L 270,105 L 285,108 L 310,106 L 335,105 L 360,102 L 385,98 L 410,95 L 435,92 L 460,88 L 480,85 L 495,65 L 508,68 L 520,78 L 535,85 L 555,92 L 575,98 L 595,104 L 620,112 L 645,118 L 670,122 L 695,120 L 720,118 L 745,116 L 770,114 L 795,112 L 815,112 L 830,118 L 845,130 L 855,145 L 870,152 L 885,155 L 905,158 L 925,165 L 940,178 L 948,195 L 952,215 L 954,235 L 950,255 L 945,275 L 938,295 L 928,315 L 915,335 L 898,355 L 885,372 L 870,390 L 858,405 L 842,415 L 825,410 L 805,405 L 785,408 L 760,412 L 735,410 L 710,412 L 685,415 L 660,415 L 635,412 L 610,408 L 590,405 L 575,410 L 560,422 L 550,438 L 542,455 L 538,470 L 532,455 L 525,438 L 520,422 L 512,408 L 495,402 L 475,408 L 455,420 L 438,430 L 420,438 L 400,440 L 380,438 L 360,432 L 342,422 L 325,415 L 305,410 L 285,408 L 265,412 L 245,418 L 225,425 L 205,428 L 185,425 L 165,418 L 148,410 L 132,402 L 118,395 L 105,388 L 95,378 L 88,368 L 98,358 L 105,350 L 98,342 L 88,335 L 80,325 L 72,312 L 80,300 L 92,290 L 85,280 L 75,270 L 68,258 L 60,248 L 70,238 L 82,228 L 75,218 L 68,208 L 75,198 L 85,188 L 78,175 L 68,162 L 78,150 L 88,138 L 78,125 L 68,112 L 78,98 L 88,85 L 102,75 L 115,68 Z"
                fill="url(#landGradient)"
                stroke="url(#landBorderGradient)"
                strokeWidth="1.6"
                filter="url(#mapShadow)"
              />

              {/* Marmara Sea Water Cutout */}
              <path
                d="M 185,122 C 200,118 215,122 232,130 C 220,142 205,145 190,140 Z"
                fill="#130e0a"
                stroke="rgba(201, 170, 103, 0.3)"
                strokeWidth="1"
              />

              {/* Curved Golden Arcs Radiating from Didim Hub */}
              {DESTINATION_CITIES.map((city, idx) => {
                const dx = city.x - DIDIM_HUB.x;
                const dy = city.y - DIDIM_HUB.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Curve upwards towards map top
                const cx = (DIDIM_HUB.x + city.x) / 2;
                const cy = Math.min(DIDIM_HUB.y, city.y) - Math.max(22, dist * 0.22);

                const isActive = activeCityId === city.id;
                const arcPath = `M ${DIDIM_HUB.x},${DIDIM_HUB.y} Q ${cx},${cy} ${city.x},${city.y}`;

                return (
                  <g key={`arc-${city.id}`}>
                    {/* Base Golden Arc */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke={isActive ? '#ffd700' : 'url(#arcGradient)'}
                      strokeWidth={isActive ? '2.5' : '1.5'}
                      strokeOpacity={isActive ? 0.95 : 0.75}
                      style={{ transition: 'all 0.3s ease', filter: isActive ? 'drop-shadow(0 0 6px #ffd700)' : 'none' }}
                    />

                    {/* Animated Light Pulse */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={isActive ? '3' : '1.8'}
                      strokeDasharray="14 120"
                      strokeDashoffset="0"
                      style={{
                        animation: `flowPulse ${4.5 + idx * 0.4}s linear infinite`,
                        animationDelay: `${idx * 0.5}s`,
                        opacity: isActive ? 1 : 0.75,
                      }}
                    />
                  </g>
                );
              })}

              {/* Destination City Nodes (Gold Dot + Black Pill Label) */}
              {DESTINATION_CITIES.map((city) => {
                const isActive = activeCityId === city.id;

                return (
                  <g
                    key={`city-${city.id}`}
                    onMouseEnter={() => setActiveCityId(city.id)}
                    onMouseLeave={() => setActiveCityId(null)}
                    onClick={() => setActiveCityId(activeCityId === city.id ? null : city.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Click Hit Target */}
                    <circle cx={city.x} cy={city.y} r="14" fill="transparent" />

                    {/* Glowing Halo Circle */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isActive ? '7.5' : '5'}
                      fill={isActive ? '#ffd700' : '#d8b45c'}
                      opacity={isActive ? '0.95' : '0.7'}
                      filter="url(#nodeGlow)"
                      style={{ transition: 'all 0.25s ease' }}
                    />

                    {/* Core City Dot */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isActive ? '4' : '2.8'}
                      fill={isActive ? '#ffffff' : '#fff4d6'}
                    />

                    {/* City Label Badge Pill (Black background + Gold stroke) */}
                    <g transform={`translate(${city.x}, ${city.y - 14})`}>
                      <rect
                        x={-(city.name.length * 3.6 + 10)}
                        y="-11"
                        width={city.name.length * 7.2 + 20}
                        height="18"
                        rx="9"
                        fill="#0c0907"
                        stroke={isActive ? '#ffd700' : 'rgba(216, 180, 92, 0.45)'}
                        strokeWidth={isActive ? '1.5' : '1'}
                        style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))', transition: 'all 0.25s ease' }}
                      />
                      <text
                        x="0"
                        y="1.5"
                        textAnchor="middle"
                        fill={isActive ? '#ffffff' : '#f0e3cc'}
                        fontSize="9.8"
                        fontWeight={isActive ? '800' : '600'}
                        fontFamily="var(--font-sans)"
                        letterSpacing="0.02em"
                      >
                        {city.name}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Didim Main Hub Node */}
              <g transform={`translate(${DIDIM_HUB.x}, ${DIDIM_HUB.y})`}>
                {/* Pulsing Radar Aura */}
                <circle cx="0" cy="0" r="10" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.8">
                  <animate attributeName="r" values="6;18;6" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2.8s" repeatCount="indefinite" />
                </circle>

                {/* Didim Glowing Core */}
                <circle cx="0" cy="0" r="6.5" fill="#ffd700" filter="url(#nodeGlow)" />
                <circle cx="0" cy="0" r="3.2" fill="#ffffff" />

                {/* Didim Main Hub Badge Pill (Identical to reference screenshot) */}
                <g transform="translate(0, -24)">
                  <rect
                    x="-55"
                    y="-13"
                    width="110"
                    height="24"
                    rx="12"
                    fill="#0f0c08"
                    stroke="#ffd700"
                    strokeWidth="1.8"
                    style={{ filter: 'drop-shadow(0 4px 16px rgba(255, 215, 0, 0.55))' }}
                  />
                  <text
                    x="0"
                    y="2.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10.8"
                    fontWeight="800"
                    fontFamily="var(--font-sans)"
                    letterSpacing="0.03em"
                  >
                    📍 Didim Merkez
                  </text>
                </g>
              </g>

            </svg>
          </div>
        </div>

        {/* Studio Guarantee Info Card */}
        <div
          style={{
            backgroundColor: '#1b1510',
            border: '1px solid rgba(201, 170, 103, 0.22)',
            borderRadius: '24px',
            padding: '36px 28px',
            maxWidth: '960px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--palm-gold, #c9aa67)', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>
            <Globe size={16} />
            MERKEZ: DİDİM / AYDIN
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#ffffff', fontWeight: 600, marginBottom: '12px' }}>
            {cmsData.studioGuaranteeTitle}
          </h3>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--palm-muted, #a39585)', lineHeight: 1.6, maxWidth: '780px', margin: '0 auto 20px auto' }}>
            {cmsData.studioGuaranteeText}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '0.88rem', color: '#ffffff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--palm-gold, #c9aa67)' }} />
              %100 Konaklama & Ulaşım Rehberi
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--palm-gold, #c9aa67)' }} />
              Tek Günde Tamamlama Garantisi
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--palm-gold, #c9aa67)' }} />
              Anında Dijital QR Teslimat
            </span>
          </div>
        </div>

      </div>

      {/* Animation Style */}
      <style jsx global>{`
        @keyframes flowPulse {
          0% {
            stroke-dashoffset: 134;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
}
