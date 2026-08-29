'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Globe, CheckCircle2 } from 'lucide-react';

// City node data representation: 1 Hub (Didim) + 7 representative cities
export interface ServiceCity {
  id: string;
  name: string;
  label: string;
  x: number;
  y: number;
  isHub?: boolean;
}

// 1 Didim Hub + 7 Representative Cities (Geographically accurate on 1000x500 SVG grid)
const SERVICE_CITIES: ServiceCity[] = [
  { id: 'didim', name: 'Didim', label: '📍 Didim Merkez', x: 135, y: 352, isHub: true },
  { id: 'istanbul', name: 'İstanbul', label: 'İstanbul', x: 235, y: 115 },
  { id: 'izmir', name: 'İzmir', label: 'İzmir', x: 132, y: 285 },
  { id: 'ankara', name: 'Ankara', label: 'Ankara', x: 410, y: 195 },
  { id: 'antalya', name: 'Antalya', label: 'Antalya', x: 310, y: 395 },
  { id: 'adana', name: 'Adana', label: 'Adana', x: 535, y: 385 },
  { id: 'samsun', name: 'Samsun', label: 'Samsun', x: 575, y: 98 },
  { id: 'diyarbakir', name: 'Diyarbakır', label: 'Diyarbakır', x: 770, y: 325 },
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
      {/* Background Radial Glow Accent */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(201, 170, 103, 0.07) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Eyebrow & Main Title */}
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

        {/* Turkey Map Container */}
        <div
          style={{
            backgroundColor: '#14100c',
            border: '1px solid rgba(201, 170, 103, 0.22)',
            borderRadius: '24px',
            padding: '24px 16px 28px 16px',
            maxWidth: '1100px',
            margin: '0 auto 40px auto',
            position: 'relative',
            boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Top Bar Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 12px 16px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: 'var(--palm-muted, #a39585)', fontFamily: 'var(--font-sans)' }}>
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
                {/* Map Land Surface Gradient */}
                <linearGradient id="turkeyMapFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2e2318" />
                  <stop offset="40%" stopColor="#453523" />
                  <stop offset="100%" stopColor="#634c31" />
                </linearGradient>

                {/* Map Border Stroke Gradient */}
                <linearGradient id="turkeyMapStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c9aa67" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#ffe6a3" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#aa8846" stopOpacity="0.75" />
                </linearGradient>

                {/* Connection Line Gradient */}
                <linearGradient id="connectionLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#c9aa67" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#8a7243" stopOpacity="0.3" />
                </linearGradient>

                {/* Drop Shadow for Land silhouette */}
                <filter id="mapShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#000000" floodOpacity="0.9" />
                </filter>

                {/* Node Radial Glow */}
                <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Grid Pattern */}
              <pattern id="seaGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(201, 170, 103, 0.025)" strokeWidth="0.8" />
              </pattern>
              <rect width="1000" height="500" fill="url(#seaGrid)" />

              {/* Real Turkey Outer Silhouette Path */}
              <path
                d="M 128,70 
                   C 142,60 156,66 172,68 
                   C 188,70 198,80 208,95 
                   C 214,102 220,105 226,108 
                   C 240,104 256,102 274,104 
                   C 304,106 336,104 368,100 
                   C 400,96 432,86 464,82 
                   C 482,78 497,60 514,60 
                   C 530,60 546,78 563,86 
                   C 585,94 612,104 642,114 
                   C 672,118 708,116 742,114 
                   C 778,112 808,108 832,108 
                   C 848,116 858,130 865,145 
                   C 880,150 904,152 924,158 
                   C 938,168 946,182 950,202 
                   C 953,232 946,260 940,284 
                   C 933,312 916,338 896,360 
                   C 878,380 866,404 850,413 
                   C 833,408 810,400 788,404 
                   C 756,408 723,406 690,408 
                   C 653,410 626,408 606,404 
                   C 586,398 570,400 556,408 
                   C 546,422 540,442 530,458 
                   C 524,442 518,422 512,404 
                   C 486,398 460,404 438,422 
                   C 416,433 394,441 376,441 
                   C 356,435 340,422 318,416 
                   C 286,406 254,400 232,406 
                   C 210,412 188,420 166,423 
                   C 146,418 132,407 117,398 
                   C 102,392 84,386 68,380 
                   C 59,369 55,357 66,347 
                   C 77,338 71,329 56,320 
                   C 45,312 51,297 72,285 
                   C 83,274 64,262 34,256 
                   C 22,244 37,229 54,217 
                   C 65,202 54,187 60,175 
                   C 35,163 46,147 67,132 
                   C 79,120 68,104 57,98 
                   C 69,78 81,56 96,50 
                   C 110,48 118,57 128,70 Z"
                fill="url(#turkeyMapFill)"
                stroke="url(#turkeyMapStroke)"
                strokeWidth="1.8"
                filter="url(#mapShadow)"
              />

              {/* Decorative Compass / Scale Indicator */}
              <g transform="translate(910, 60)" opacity="0.45">
                <circle cx="0" cy="0" r="16" fill="none" stroke="var(--palm-gold)" strokeWidth="0.8" />
                <path d="M 0,-12 L 0,12 M -12,0 L 12,0" stroke="var(--palm-gold)" strokeWidth="0.8" />
                <text x="0" y="-17" textAnchor="middle" fill="var(--palm-gold)" fontSize="8" fontWeight="700" fontFamily="var(--font-sans)">K</text>
              </g>

              {/* 7 Connection Curved Arcs originating from Didim */}
              {DESTINATION_CITIES.map((city, idx) => {
                const dx = city.x - DIDIM_HUB.x;
                const dy = city.y - DIDIM_HUB.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate smooth Bezier control point curving towards top
                const cx = (DIDIM_HUB.x + city.x) / 2;
                const cy = Math.min(DIDIM_HUB.y, city.y) - Math.max(25, dist * 0.22);

                const isActive = activeCityId === city.id;
                const arcPath = `M ${DIDIM_HUB.x},${DIDIM_HUB.y} Q ${cx},${cy} ${city.x},${city.y}`;

                return (
                  <g key={`arc-${city.id}`}>
                    {/* Base Subtle Gold Arc */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke={isActive ? '#ffd700' : 'url(#connectionLineGradient)'}
                      strokeWidth={isActive ? '2.4' : '1.4'}
                      strokeOpacity={isActive ? 0.95 : 0.65}
                      style={{ transition: 'all 0.3s ease' }}
                    />

                    {/* Gentle Moving Pulse Light Along Curve */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={isActive ? '3' : '1.8'}
                      strokeDasharray="12 120"
                      strokeDashoffset="0"
                      style={{
                        animation: `flowPulse ${5 + idx * 0.5}s linear infinite`,
                        animationDelay: `${idx * 0.6}s`,
                        filter: isActive ? 'drop-shadow(0 0 6px #ffd700)' : 'none',
                        opacity: isActive ? 1 : 0.7,
                      }}
                    />
                  </g>
                );
              })}

              {/* 7 Destination Cities (Small Gold Dot + Label Pill) */}
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
                    {/* Target Click Area */}
                    <circle cx={city.x} cy={city.y} r="14" fill="transparent" />

                    {/* Outer Subtle Pulse Ring */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isActive ? '7' : '4.5'}
                      fill={isActive ? '#ffd700' : '#c9aa67'}
                      opacity={isActive ? '0.9' : '0.45'}
                      filter="url(#hubGlow)"
                      style={{ transition: 'all 0.25s ease' }}
                    />

                    {/* Core City Dot */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isActive ? '3.8' : '2.5'}
                      fill={isActive ? '#ffffff' : '#f0e0c0'}
                    />

                    {/* Minimal City Label Badge Pill */}
                    <g transform={`translate(${city.x}, ${city.y - 13})`}>
                      <rect
                        x={-(city.name.length * 3.6 + 9)}
                        y="-11"
                        width={city.name.length * 7.2 + 18}
                        height="17"
                        rx="8.5"
                        fill="rgba(16, 12, 9, 0.88)"
                        stroke={isActive ? '#ffd700' : 'rgba(201, 170, 103, 0.38)'}
                        strokeWidth={isActive ? '1.4' : '0.9'}
                        style={{ transition: 'all 0.25s ease' }}
                      />
                      <text
                        x="0"
                        y="1"
                        textAnchor="middle"
                        fill={isActive ? '#ffffff' : '#ebdcc5'}
                        fontSize="9.5"
                        fontWeight={isActive ? '700' : '600'}
                        fontFamily="var(--font-sans)"
                        letterSpacing="0.02em"
                      >
                        {city.name}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Main Hub: DİDİM MERKEZ */}
              <g transform={`translate(${DIDIM_HUB.x}, ${DIDIM_HUB.y})`}>
                {/* Radar Ring Glow Animation */}
                <circle cx="0" cy="0" r="10" fill="none" stroke="#ffd700" strokeWidth="1.8" opacity="0.7">
                  <animate attributeName="r" values="6;16;6" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Didim Core Circle */}
                <circle cx="0" cy="0" r="6" fill="#ffd700" filter="url(#hubGlow)" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />

                {/* Didim Hub Badge Pill */}
                <g transform="translate(0, -23)">
                  <rect
                    x="-54"
                    y="-13"
                    width="108"
                    height="23"
                    rx="11.5"
                    fill="#120e0a"
                    stroke="#ffd700"
                    strokeWidth="1.8"
                    style={{ filter: 'drop-shadow(0 4px 14px rgba(255, 215, 0, 0.45))' }}
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10.5"
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

      {/* Global Animation Styles */}
      <style jsx global>{`
        @keyframes flowPulse {
          0% {
            stroke-dashoffset: 132;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
}
