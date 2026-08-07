'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Sparkles, Navigation, Globe, CheckCircle2 } from 'lucide-react';

// Data types for 81 Turkey Cities
export interface CityNode {
  id: number;
  code: string;
  name: string;
  x: number;
  y: number;
  region: 'Ege' | 'Marmara' | 'İç Anadolu' | 'Akdeniz' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu';
  isMajor?: boolean;
  couple?: {
    names: string;
    concept: string;
    location: string;
  };
}

// Origin coordinates: Didim / Aydın on SVG map grid (0-1000 x 0-520)
const DIDIM_ORIGIN = {
  name: 'Didim',
  fullLabel: 'Didim • Stüdyo Merkez',
  code: '09',
  x: 145,
  y: 350,
};

// All 81 Provinces of Turkey with geographic coordinates & sample couple stories
const CITIES_81: CityNode[] = [
  { id: 1, code: '01', name: 'Adana', x: 520, y: 395, region: 'Akdeniz', isMajor: true, couple: { names: 'Selin & Can', concept: 'Sunset Konsept', location: 'Adana' } },
  { id: 2, code: '02', name: 'Adıyaman', x: 650, y: 335, region: 'Güneydoğu Anadolu' },
  { id: 3, code: '03', name: 'Afyonkarahisar', x: 280, y: 285, region: 'Ege' },
  { id: 4, code: '04', name: 'Ağrı', x: 885, y: 215, region: 'Doğu Anadolu' },
  { id: 5, code: '05', name: 'Amasya', x: 535, y: 165, region: 'Karadeniz' },
  { id: 6, code: '06', name: 'Ankara', x: 405, y: 210, region: 'İç Anadolu', isMajor: true, couple: { names: 'Elif & Burak', concept: 'Dış Mekan Hikâyesi', location: 'Ankara' } },
  { id: 7, code: '07', name: 'Antalya', x: 320, y: 405, region: 'Akdeniz', isMajor: true, couple: { names: 'Zeynep & Emre', concept: 'Sahil & Gün Batımı', location: 'Antalya' } },
  { id: 8, code: '08', name: 'Artvin', x: 810, y: 125, region: 'Karadeniz' },
  { id: 9, code: '09', name: 'Aydın', x: 168, y: 345, region: 'Ege', isMajor: true, couple: { names: 'Gamze & Onur', concept: 'Stüdyo & Dış Çekim', location: 'Aydın' } },
  { id: 10, code: '10', name: 'Balıkesir', x: 175, y: 230, region: 'Marmara' },
  { id: 11, code: '11', name: 'Bilecik', x: 270, y: 205, region: 'Marmara' },
  { id: 12, code: '12', name: 'Bingöl', x: 770, y: 270, region: 'Doğu Anadolu' },
  { id: 13, code: '13', name: 'Bitlis', x: 840, y: 300, region: 'Doğu Anadolu' },
  { id: 14, code: '14', name: 'Bolu', x: 335, y: 170, region: 'Karadeniz' },
  { id: 15, code: '15', name: 'Burdur', x: 275, y: 360, region: 'Akdeniz' },
  { id: 16, code: '16', name: 'Bursa', x: 230, y: 195, region: 'Marmara', isMajor: true, couple: { names: 'Büşra & Kaan', concept: 'Zeytinlik & Plato', location: 'Bursa' } },
  { id: 17, code: '17', name: 'Çanakkale', x: 120, y: 200, region: 'Marmara' },
  { id: 18, code: '18', name: 'Çankırı', x: 420, y: 165, region: 'İç Anadolu' },
  { id: 19, code: '19', name: 'Çorum', x: 480, y: 165, region: 'Karadeniz' },
  { id: 20, code: '20', name: 'Denizli', x: 220, y: 340, region: 'Ege' },
  { id: 21, code: '21', name: 'Diyarbakır', x: 755, y: 330, region: 'Güneydoğu Anadolu', isMajor: true, couple: { names: 'Berfin & Murat', concept: 'Tarihi Dış Çekim', location: 'Diyarbakır' } },
  { id: 22, code: '22', name: 'Edirne', x: 135, y: 105, region: 'Marmara' },
  { id: 23, code: '23', name: 'Elazığ', x: 715, y: 285, region: 'Doğu Anadolu' },
  { id: 24, code: '24', name: 'Erzincan', x: 715, y: 220, region: 'Doğu Anadolu' },
  { id: 25, code: '25', name: 'Erzurum', x: 790, y: 200, region: 'Doğu Anadolu', isMajor: true, couple: { names: 'Sinem & Ogün', concept: 'Özel Albüm Çekimi', location: 'Erzurum' } },
  { id: 26, code: '26', name: 'Eskişehir', x: 310, y: 235, region: 'İç Anadolu' },
  { id: 27, code: '27', name: 'Gaziantep', x: 605, y: 380, region: 'Güneydoğu Anadolu', isMajor: true, couple: { names: 'Yaren & Ali', concept: 'Düğün Belgeseli', location: 'Gaziantep' } },
  { id: 28, code: '28', name: 'Giresun', x: 650, y: 145, region: 'Karadeniz' },
  { id: 29, code: '29', name: 'Gümüşhane', x: 695, y: 175, region: 'Karadeniz' },
  { id: 30, code: '30', name: 'Hakkari', x: 925, y: 365, region: 'Doğu Anadolu' },
  { id: 31, code: '31', name: 'Hatay', x: 550, y: 445, region: 'Akdeniz' },
  { id: 32, code: '32', name: 'Isparta', x: 290, y: 350, region: 'Akdeniz' },
  { id: 33, code: '33', name: 'Mersin', x: 470, y: 410, region: 'Akdeniz' },
  { id: 34, code: '34', name: 'İstanbul', x: 240, y: 145, region: 'Marmara', isMajor: true, couple: { names: 'Gizem & Arda', concept: 'Özel Plato Çekimi', location: 'İstanbul' } },
  { id: 35, code: '35', name: 'İzmir', x: 140, y: 300, region: 'Ege', isMajor: true, couple: { names: 'Derya & Mert', concept: 'Aşk Bahçeleri', location: 'İzmir' } },
  { id: 36, code: '36', name: 'Kars', x: 875, y: 155, region: 'Doğu Anadolu' },
  { id: 37, code: '37', name: 'Kastamonu', x: 435, y: 120, region: 'Karadeniz' },
  { id: 38, code: '38', name: 'Kayseri', x: 535, y: 270, region: 'İç Anadolu' },
  { id: 39, code: '39', name: 'Kırklareli', x: 165, y: 95, region: 'Marmara' },
  { id: 40, code: '40', name: 'Kırşehir', x: 450, y: 250, region: 'İç Anadolu' },
  { id: 41, code: '41', name: 'Kocaeli', x: 275, y: 155, region: 'Marmara' },
  { id: 42, code: '42', name: 'Konya', x: 400, y: 335, region: 'İç Anadolu', isMajor: true, couple: { names: 'Ayşe & Mehmet', concept: 'Görkemli Dış Çekim', location: 'Konya' } },
  { id: 43, code: '43', name: 'Kütahya', x: 245, y: 245, region: 'Ege' },
  { id: 44, code: '44', name: 'Malatya', x: 645, y: 290, region: 'Doğu Anadolu' },
  { id: 45, code: '45', name: 'Manisa', x: 165, y: 280, region: 'Ege' },
  { id: 46, code: '46', name: 'Kahramanmaraş', x: 585, y: 335, region: 'Akdeniz' },
  { id: 47, code: '47', name: 'Mardin', x: 775, y: 375, region: 'Güneydoğu Anadolu' },
  { id: 48, code: '48', name: 'Muğla', x: 175, y: 380, region: 'Ege', isMajor: true, couple: { names: 'Melis & Tolga', concept: 'Bodrum Sahil Çekimi', location: 'Muğla' } },
  { id: 49, code: '49', name: 'Muş', x: 815, y: 270, region: 'Doğu Anadolu' },
  { id: 50, code: '50', name: 'Nevşehir', x: 480, y: 265, region: 'İç Anadolu' },
  { id: 51, code: '51', name: 'Niğde', x: 485, y: 315, region: 'İç Anadolu' },
  { id: 52, code: '52', name: 'Ordu', x: 610, y: 140, region: 'Karadeniz' },
  { id: 53, code: '53', name: 'Rize', x: 745, y: 130, region: 'Karadeniz' },
  { id: 54, code: '54', name: 'Sakarya', x: 300, y: 160, region: 'Marmara' },
  { id: 55, code: '55', name: 'Samsun', x: 545, y: 120, region: 'Karadeniz', isMajor: true, couple: { names: 'Buse & Eren', concept: 'Gün Batımı Çekimi', location: 'Samsun' } },
  { id: 56, code: '56', name: 'Siirt', x: 825, y: 340, region: 'Güneydoğu Anadolu' },
  { id: 57, code: '57', name: 'Sinop', x: 490, y: 95, region: 'Karadeniz' },
  { id: 58, code: '58', name: 'Sivas', x: 600, y: 220, region: 'İç Anadolu' },
  { id: 59, code: '59', name: 'Tekirdağ', x: 175, y: 130, region: 'Marmara' },
  { id: 60, code: '60', name: 'Tokat', x: 565, y: 175, region: 'Karadeniz' },
  { id: 61, code: '61', name: 'Trabzon', x: 700, y: 135, region: 'Karadeniz', isMajor: true, couple: { names: 'Aslı & Cem', concept: 'Doğa & Plato Çekimi', location: 'Trabzon' } },
  { id: 62, code: '62', name: 'Tunceli', x: 720, y: 255, region: 'Doğu Anadolu' },
  { id: 63, code: '63', name: 'Şanlıurfa', x: 675, y: 375, region: 'Güneydoğu Anadolu' },
  { id: 64, code: '64', name: 'Uşak', x: 225, y: 290, region: 'Ege' },
  { id: 65, code: '65', name: 'Van', x: 890, y: 295, region: 'Doğu Anadolu', isMajor: true, couple: { names: 'Ceren & Görkem', concept: 'Özel Dış Mekan', location: 'Van' } },
  { id: 66, code: '66', name: 'Yozgat', x: 495, y: 215, region: 'İç Anadolu' },
  { id: 67, code: '67', name: 'Zonguldak', x: 350, y: 130, region: 'Karadeniz' },
  { id: 68, code: '68', name: 'Aksaray', x: 450, y: 295, region: 'İç Anadolu' },
  { id: 69, code: '69', name: 'Bayburt', x: 740, y: 175, region: 'Karadeniz' },
  { id: 70, code: '70', name: 'Karaman', x: 435, y: 375, region: 'İç Anadolu' },
  { id: 71, code: '71', name: 'Kırıkkale', x: 435, y: 210, region: 'İç Anadolu' },
  { id: 72, code: '72', name: 'Batman', x: 795, y: 340, region: 'Güneydoğu Anadolu' },
  { id: 73, code: '73', name: 'Şırnak', x: 855, y: 370, region: 'Güneydoğu Anadolu' },
  { id: 74, code: '74', name: 'Bartın', x: 375, y: 120, region: 'Karadeniz' },
  { id: 75, code: '75', name: 'Ardahan', x: 860, y: 130, region: 'Doğu Anadolu' },
  { id: 76, code: '76', name: 'Iğdır', x: 920, y: 190, region: 'Doğu Anadolu' },
  { id: 77, code: '77', name: 'Yalova', x: 245, y: 165, region: 'Marmara' },
  { id: 78, code: '78', name: 'Karabük', x: 380, y: 135, region: 'Karadeniz' },
  { id: 79, code: '79', name: 'Kilis', x: 585, y: 405, region: 'Güneydoğu Anadolu' },
  { id: 80, code: '80', name: 'Osmaniye', x: 555, y: 375, region: 'Akdeniz' },
  { id: 81, code: '81', name: 'Düzce', x: 320, y: 155, region: 'Karadeniz' },
];

// Featured couples list for auto-rotation card
const FEATURED_COUPLES = CITIES_81.filter(c => c.couple);

export default function ServiceAreaSection() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Tüm Türkiye');
  const [activeCity, setActiveCity] = useState<CityNode | null>(CITIES_81.find(c => c.name === 'İzmir') || null);
  const [coupleIndex, setCoupleIndex] = useState(0);
  const [cmsData, setCmsData] = useState({
    eyebrow: 'NEREDEN GELİYORLAR?',
    title: 'Didim’deyiz, hikâyeleriniz Türkiye’nin 81 ilinden geliyor.',
    description: 'Didim merkez stüdyomuzdan Türkiye’nin 81 iline ışınlanan anılar ve yurt dışından gelen çiftlerimiz için çekim, konsept ve organizasyon süreçlerini tek çatı altında planlıyoruz.',
    studioGuaranteeTitle: 'Tüm çekimler ve organizasyon detayları stüdyomuz koordinasyonunda yönetilir.',
    studioGuaranteeText: 'Türkiye’nin 81 ilinden veya yurt dışından gelen tüm çiftlerimiz için Didim merkez stüdyomuzda çekim, gelinlik, saç & makyaj, konaklama ve ulaşım planlamasını tek güne sığdırarak stresi sıfıra indiriyoruz.',
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

  // Auto cycle featured couples every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCoupleIndex((prev) => {
        const nextIdx = (prev + 1) % FEATURED_COUPLES.length;
        setActiveCity(FEATURED_COUPLES[nextIdx]);
        return nextIdx;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Filter cities by selected region
  const filteredCities = selectedRegion === 'Tüm Türkiye' 
    ? CITIES_81 
    : CITIES_81.filter(c => c.region === selectedRegion);

  const activeCoupleData = activeCity?.couple || FEATURED_COUPLES[coupleIndex].couple;

  return (
    <section
      style={{
        padding: '90px 20px 110px 20px',
        backgroundColor: 'var(--palm-deep-brown)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Lighting Accent */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(201, 170, 103, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Subtitle & Unified Typography Title */}
        <div 
          style={{ 
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem', 
            fontWeight: 700, 
            letterSpacing: '0.2em', 
            color: 'var(--palm-gold)', 
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
            color: 'var(--palm-muted)',
            lineHeight: 1.7,
            maxWidth: '740px',
            margin: '0 auto 40px auto',
          }}
        >
          {cmsData.description}
        </p>

        {/* Quick Region Selector Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            maxWidth: '960px',
            margin: '0 auto 40px auto',
          }}
        >
          {['Tüm Türkiye', 'Ege', 'Marmara', 'İç Anadolu', 'Akdeniz', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu Anadolu'].map((reg) => {
            const isSelected = selectedRegion === reg;
            return (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  padding: '8px 18px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--palm-gold)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#0d0b09' : '#e0d8cc',
                  border: isSelected ? '1px solid var(--palm-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected ? '0 4px 15px rgba(201, 170, 103, 0.35)' : 'none',
                }}
              >
                {reg === 'Tüm Türkiye' ? '⚡ 81 İl (Tüm Türkiye)' : reg}
              </button>
            );
          })}
        </div>

        {/* 3D Interactive Dark Gold Turkey Teleportation Map Container */}
        <div
          style={{
            backgroundColor: '#16120e',
            border: '1px solid rgba(201, 170, 103, 0.25)',
            borderRadius: '24px',
            padding: '24px 16px 28px 16px',
            maxWidth: '1100px',
            margin: '0 auto 40px auto',
            position: 'relative',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Top Map Status Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px 16px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--palm-gold)', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              <Sparkles size={16} />
              <span>DİDİM ÇIKIŞLI 81 İLE IŞINLANMA EFEKTİ</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--palm-muted)', fontFamily: 'var(--font-sans)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffd700', boxShadow: '0 0 8px #ffd700' }} />
                Didim Stüdyo Merkez
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c9aa67' }} />
                81 İl Hedef Çiftler
              </span>
            </div>
          </div>

          {/* SVG Turkey Map Component */}
          <div style={{ position: 'relative', width: '100%', height: 'auto', aspectRatio: '1000 / 520' }}>
            <svg
              viewBox="0 0 1000 520"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <defs>
                {/* 3D Land Gold Gradient */}
                <linearGradient id="turkeyGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3d3021" />
                  <stop offset="50%" stopColor="#5c4930" />
                  <stop offset="100%" stopColor="#8a7047" />
                </linearGradient>

                {/* 3D Border Glow Gradient */}
                <linearGradient id="turkeyBorderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c9aa67" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ffe29a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#b59450" stopOpacity="0.8" />
                </linearGradient>

                {/* Teleport Beam Laser Gradient */}
                <linearGradient id="teleportLaserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#c9aa67" stopOpacity="0.6" />
                </linearGradient>

                {/* Map Drop Shadow */}
                <filter id="mapShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="#000000" floodOpacity="0.95" />
                </filter>

                {/* Node Radial Blur Glow */}
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Map Sea Grid Accents */}
              <pattern id="seaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201, 170, 103, 0.03)" strokeWidth="0.8" />
              </pattern>
              <rect width="1000" height="520" fill="url(#seaGrid)" />

              {/* 3D Extrusion Bottom Relief Shadow Path */}
              <path
                d="M 115,100 C 125,92 135,84 145,85 C 160,86 170,88 180,95 C 188,105 195,118 215,130 C 230,132 245,128 255,145 C 250,150 230,145 205,140 C 180,142 165,155 145,185 C 130,190 115,205 105,225 C 118,245 125,260 138,295 C 142,315 133,330 145,348 C 136,358 152,366 160,370 C 168,364 174,372 178,385 C 188,375 205,362 225,365 C 245,370 270,358 290,380 C 310,400 325,412 345,410 C 375,390 400,380 425,382 C 455,400 480,418 505,410 C 525,420 540,440 548,465 C 558,460 564,445 560,410 C 580,395 615,388 650,388 C 700,382 750,370 800,380 C 850,382 890,382 915,378 C 935,365 922,342 945,300 C 925,275 928,240 895,205 C 875,160 840,125 780,120 C 730,130 680,132 630,138 C 570,118 520,90 490,95 C 450,110 400,122 355,132 C 310,150 275,145 255,130 Z"
                transform="translate(0, 16)"
                fill="#0d0a07"
                stroke="#261d13"
                strokeWidth="2"
              />

              {/* Main 3D Turkey Land Contour */}
              <path
                d="M 115,100 C 125,92 135,84 145,85 C 160,86 170,88 180,95 C 188,105 195,118 215,130 C 230,132 245,128 255,145 C 250,150 230,145 205,140 C 180,142 165,155 145,185 C 130,190 115,205 105,225 C 118,245 125,260 138,295 C 142,315 133,330 145,348 C 136,358 152,366 160,370 C 168,364 174,372 178,385 C 188,375 205,362 225,365 C 245,370 270,358 290,380 C 310,400 325,412 345,410 C 375,390 400,380 425,382 C 455,400 480,418 505,410 C 525,420 540,440 548,465 C 558,460 564,445 560,410 C 580,395 615,388 650,388 C 700,382 750,370 800,380 C 850,382 890,382 915,378 C 935,365 922,342 945,300 C 925,275 928,240 895,205 C 875,160 840,125 780,120 C 730,130 680,132 630,138 C 570,118 520,90 490,95 C 450,110 400,122 355,132 C 310,150 275,145 255,130 Z"
                fill="url(#turkeyGoldGradient)"
                stroke="url(#turkeyBorderGradient)"
                strokeWidth="1.8"
                filter="url(#mapShadow)"
              />

              {/* Decorative Internal Latitude Lines */}
              <path d="M 120,200 Q 500,220 920,200" fill="none" stroke="rgba(201, 170, 103, 0.08)" strokeWidth="1" strokeDasharray="4 6" />
              <path d="M 130,300 Q 500,340 920,300" fill="none" stroke="rgba(201, 170, 103, 0.08)" strokeWidth="1" strokeDasharray="4 6" />
              <path d="M 300,140 Q 330,300 340,410" fill="none" stroke="rgba(201, 170, 103, 0.08)" strokeWidth="1" strokeDasharray="4 6" />
              <path d="M 600,135 Q 610,280 600,385" fill="none" stroke="rgba(201, 170, 103, 0.08)" strokeWidth="1" strokeDasharray="4 6" />

              {/* Teleportation Curved Beams ("Işınlanma Efekti") from Didim to Cities */}
              {filteredCities.map((city, idx) => {
                // Calculate Bezier Arc Control Point
                const dx = city.x - DIDIM_ORIGIN.x;
                const dy = city.y - DIDIM_ORIGIN.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const cx = (DIDIM_ORIGIN.x + city.x) / 2;
                const cy = Math.min(DIDIM_ORIGIN.y, city.y) - Math.max(30, dist * 0.24);

                const isActive = activeCity?.id === city.id;
                const isSelectedRegionCity = selectedRegion === 'Tüm Türkiye' || city.region === selectedRegion;

                if (!isSelectedRegionCity && !isActive) return null;

                const arcPath = `M ${DIDIM_ORIGIN.x},${DIDIM_ORIGIN.y} Q ${cx},${cy} ${city.x},${city.y}`;

                return (
                  <g key={`beam-${city.id}`}>
                    {/* Subtle Base Arc Line */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke={isActive ? 'rgba(255, 215, 0, 0.8)' : 'rgba(201, 170, 103, 0.2)'}
                      strokeWidth={isActive ? '2.5' : '1.2'}
                    />

                    {/* Animated Laser Teleport Particle Dash */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke="url(#teleportLaserGradient)"
                      strokeWidth={isActive ? '3.5' : '2'}
                      strokeDasharray="20 100"
                      className="animate-teleport-dash"
                      style={{
                        animationDelay: `${(idx % 10) * 0.24}s`,
                        filter: isActive ? 'drop-shadow(0 0 6px #ffd700)' : 'none',
                      }}
                    />

                    {/* Active Destination Impact Pulse */}
                    {isActive && (
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="14"
                        fill="none"
                        stroke="#ffd700"
                        strokeWidth="1.5"
                        className="animate-radar-pulse"
                      />
                    )}
                  </g>
                );
              })}

              {/* 81 Glowing City Nodes */}
              {filteredCities.map((city) => {
                const isActive = activeCity?.id === city.id;

                return (
                  <g
                    key={`node-${city.id}`}
                    onClick={() => setActiveCity(city)}
                    onMouseEnter={() => setActiveCity(city)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Touch & Click Target Area */}
                    <circle cx={city.x} cy={city.y} r="12" fill="transparent" />

                    {/* Outer Glow Halo */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isActive ? '6' : '3.5'}
                      fill={isActive ? '#ffd700' : '#c9aa67'}
                      opacity={isActive ? '0.9' : '0.5'}
                      filter="url(#nodeGlow)"
                    />

                    {/* Core City Dot */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isActive ? '4' : '2.2'}
                      fill={isActive ? '#ffffff' : '#e1c98f'}
                    />

                    {/* Major City Name Labels */}
                    {(city.isMajor || isActive) && (
                      <g transform={`translate(${city.x}, ${city.y - 12})`}>
                        {/* Text Backdrop Badge */}
                        <rect
                          x={-(city.name.length * 3.8 + 8)}
                          y="-11"
                          width={city.name.length * 7.6 + 16}
                          height="16"
                          rx="8"
                          fill="rgba(15, 12, 9, 0.88)"
                          stroke={isActive ? 'var(--palm-gold)' : 'rgba(201, 170, 103, 0.35)'}
                          strokeWidth={isActive ? '1.2' : '0.8'}
                        />
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          fill={isActive ? '#ffffff' : '#e1c98f'}
                          fontSize="9.5"
                          fontWeight={isActive ? '800' : '600'}
                          fontFamily="var(--font-sans)"
                        >
                          {city.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Origin Beacon Point: Didim (Aydın) */}
              <g transform={`translate(${DIDIM_ORIGIN.x}, ${DIDIM_ORIGIN.y})`}>
                {/* Multiple Radar Pulse Rings */}
                <circle cx="0" cy="0" r="8" fill="none" stroke="#ffd700" strokeWidth="2" className="animate-radar-pulse" />
                <circle cx="0" cy="0" r="8" fill="none" stroke="#ffe29a" strokeWidth="1.5" className="animate-radar-pulse" style={{ animationDelay: '1.2s' }} />

                {/* Didim Glowing Core */}
                <circle cx="0" cy="0" r="6" fill="#ffd700" filter="url(#nodeGlow)" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />

                {/* Prominent Didim Origin Badge */}
                <g transform="translate(0, -22)">
                  <rect
                    x="-55"
                    y="-14"
                    width="110"
                    height="22"
                    rx="11"
                    fill="#110d09"
                    stroke="var(--palm-gold)"
                    strokeWidth="1.8"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(201, 170, 103, 0.5))' }}
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10.5"
                    fontWeight="800"
                    fontFamily="var(--font-sans)"
                    letterSpacing="0.04em"
                  >
                    📍 Didim • Stüdyo
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Floating Couple Story Card (Overlay lower-left like in reference image 1) */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: 'rgba(18, 14, 10, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(201, 170, 103, 0.35)',
              borderRadius: '16px',
              padding: '16px 20px',
              textAlign: 'left',
              maxWidth: '310px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              zIndex: 10,
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--palm-gold)', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                BU HAFTA ÇEKİM HİKÂYESİ
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
              {activeCoupleData?.names || 'Derya & Mert'}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--palm-muted)', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} style={{ color: 'var(--palm-gold)' }} />
              <span>{activeCity?.name || 'İzmir'}’den</span>
              <span>•</span>
              <span style={{ color: '#ffffff' }}>{activeCoupleData?.concept || 'Aşk Bahçeleri Konsepti'}</span>
            </div>
          </div>
        </div>

        {/* Central Studio & Regional Logistics Guarantee Box */}
        <div
          style={{
            backgroundColor: '#1c1611',
            border: '1px solid rgba(201, 170, 103, 0.2)',
            borderRadius: '24px',
            padding: '36px 28px',
            maxWidth: '960px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>
            <Globe size={16} />
            MERKEZ STÜDYO: DİDİM / AYDIN
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#ffffff', fontWeight: 600, marginBottom: '12px' }}>
            {cmsData.studioGuaranteeTitle}
          </h3>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--palm-muted)', lineHeight: 1.6, maxWidth: '780px', margin: '0 auto 20px auto' }}>
            {cmsData.studioGuaranteeText}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '0.88rem', color: '#ffffff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--palm-gold)' }} />
              %100 Konaklama & Ulaşım Rehberi
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--palm-gold)' }} />
              Tek Günde Tamamlama Garantisi
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--palm-gold)' }} />
              Anında Dijital QR Teslimat
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
