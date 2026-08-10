'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  MapPin, 
  Clock, 
  PhoneCall, 
  MessageSquare, 
  Send,
  Heart,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { TURKEY_CITIES } from '@/data/turkeyCities';

const SERVICES = [
  'Fotoğraf Çekimi',
  'Sinematik Video Çekimi',
  'Albüm Baskı',
  'QR Dijital Anı Albümü',
  'VIP Tam Paket (Tüm Hizmetler)',
];

const CONCEPTS = [
  'Sahil & Deniz Kenarı Çekimi',
  'Kır & Ağaçlık Alan Çekimi',
  'İç Mekan & Salon Çekimi',
  'Dış Mekan & Tarihi Doku Çekimi',
  'Gün Batımı & Altın Saatler',
  'Özel Plato Çekimi',
];

export default function RezervasyonPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>(['VIP Tam Paket (Tüm Hizmetler)']);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>(['Zamansız Beyaz']);
  const [names, setNames] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  
  // City & District Selection State
  const [selectedCityName, setSelectedCityName] = useState<string>('Aydın');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Didim');
  const [addressDetails, setAddressDetails] = useState('');

  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Active City Data
  const currentCityObj = TURKEY_CITIES.find(c => c.name === selectedCityName) || TURKEY_CITIES[0];

  const handleCityChange = (cityName: string) => {
    setSelectedCityName(cityName);
    const targetCity = TURKEY_CITIES.find(c => c.name === cityName);
    if (targetCity && targetCity.districts.length > 0) {
      // Default to Didim if Aydın, otherwise first district
      if (cityName === 'Aydın' && targetCity.districts.includes('Didim')) {
        setSelectedDistrictName('Didim');
      } else {
        setSelectedDistrictName(targetCity.districts[0]);
      }
    } else {
      setSelectedDistrictName('Merkez');
    }
  };

  const handleServiceToggle = (srv: string) => {
    if (srv === 'VIP Tam Paket (Tüm Hizmetler)') {
      if (selectedServices.includes(srv)) {
        setSelectedServices(['Fotoğraf Çekimi']);
      } else {
        setSelectedServices(['VIP Tam Paket (Tüm Hizmetler)']);
      }
      return;
    }

    let updated = selectedServices.filter(s => s !== 'VIP Tam Paket (Tüm Hizmetler)');
    if (updated.includes(srv)) {
      updated = updated.filter(s => s !== srv);
    } else {
      updated.push(srv);
    }

    if (updated.length === 0) {
      updated = [srv];
    }
    setSelectedServices(updated);
  };

  const handleConceptToggle = (cpt: string) => {
    let updated = [...selectedConcepts];
    if (updated.includes(cpt)) {
      if (updated.length > 1) {
        updated = updated.filter(c => c !== cpt);
      }
    } else {
      updated.push(cpt);
    }
    setSelectedConcepts(updated);
  };

  const formattedLocation = `${selectedCityName} / ${selectedDistrictName}${addressDetails ? ` (${addressDetails})` : ''}`;
  const formattedServicesStr = selectedServices.join(', ');
  const formattedConceptsStr = selectedConcepts.join(', ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!names || !phone) {
      alert('Lütfen ad soyad ve telefon numaranızı girin.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          names,
          phone,
          date,
          city: formattedLocation,
          selectedService: formattedServicesStr,
          selectedConcept: formattedConceptsStr,
          notes,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitted(true);
      } else {
        alert(json.error || 'Talebiniz kaydedilirken bir hata oluştu.');
      }
    } catch (err: any) {
      alert('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppMessage = () => {
    const text = `Merhaba Palm Stüdyo, Didim çekim rezervasyonu için fiyat teklifi almak istiyorum:

💍 *Çift İsimleri:* ${names || 'Belirtilmedi'}
✨ *Seçilen Hizmetler:* ${formattedServicesStr}
📸 *Konseptler:* ${formattedConceptsStr}
📅 *Tahmini Tarih:* ${date || 'Belirtilmedi'}
📍 *Lokasyon:* ${formattedLocation}
📝 *Notlar:* ${notes || 'Yok'}`;

    return siteConfig.getWhatsAppLink(text);
  };

  return (
    <div style={{ backgroundColor: 'var(--palm-black)', minHeight: '100vh', color: '#ffffff', paddingBottom: '100px' }}>
      
      {/* Top Banner & Header */}
      <section
        style={{
          padding: '80px 24px 60px 24px',
          backgroundColor: 'var(--palm-deep-brown)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--palm-gold)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '24px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Anasayfaya Dön</span>
          </Link>

          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--palm-gold)',
              textTransform: 'uppercase',
              marginBottom: '12px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ONLINE REZERVASYON & ÖZEL FİYAT TEKLİFİ
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '18px',
            }}
          >
            Hayalinizdeki Çekimi{' '}
            <span style={{ color: 'var(--palm-gold)', fontStyle: 'italic' }}>
              Birlikte Planlayalım.
            </span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
              color: 'var(--palm-muted)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Didim merkez stüdyomuz veya Türkiye’nin 81 ilindeki çekim paketlerimiz için tarih seçin, 2 dakikada size özel detaylı fiyat teklifinizi oluşturup iletelim.
          </p>

        </div>
      </section>

      {/* Main Reservation Form Section */}
      <section style={{ maxWidth: '960px', margin: '60px auto 0 auto', padding: '0 24px' }}>
        
        {submitted ? (
          <div
            style={{
              backgroundColor: 'var(--palm-surface)',
              border: '1px solid var(--palm-gold)',
              borderRadius: '24px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(201, 170, 103, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: 'var(--palm-gold)' }}>
              <CheckCircle size={36} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#ffffff', marginBottom: '14px' }}>
              Rezervasyon Talebiniz Başarıyla Alındı!
            </h2>

            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--palm-muted)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
              Sayın <strong style={{ color: '#fff' }}>{names}</strong>, talebiniz ekibimize ulaştı. Didim stüdyo koordinatörümüz en kısa sürede telefon ve WhatsApp üzerinden sizinle iletişime geçecektir.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <a
                href={getWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="palm-btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                }}
              >
                <MessageSquare size={18} />
                <span>WhatsApp İle Hızlı Fiyat Doğrula</span>
              </a>

              <Link
                href="/"
                className="palm-btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                }}
              >
                <span>Anasayfaya Dön</span>
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: 'var(--palm-surface)',
              border: '1px solid rgba(201, 170, 103, 0.25)',
              borderRadius: '24px',
              padding: '44px 36px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            {/* Step 1: Select Service (Multi-Select) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--palm-gold)', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                  1. İSTEDİĞİNİZ ÇEKİM / HİZMET TÜRÜNÜ SEÇİN
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--palm-muted)' }}>(Birden fazla seçebilirsiniz)</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {SERVICES.map((srv) => {
                  const isSelected = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => handleServiceToggle(srv)}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        padding: '10px 18px',
                        borderRadius: '30px',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? 'var(--palm-gold)' : '#1c1611',
                        color: isSelected ? '#0d0b09' : 'var(--palm-muted)',
                        border: isSelected ? '1px solid var(--palm-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {isSelected && <Check size={14} />}
                      <span>{srv}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Concept (Multi-Select) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--palm-gold)', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                  2. TERCİH ETTİĞİNİZ ÇEKİM KONSEPTİ
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--palm-muted)' }}>(Birden fazla seçebilirsiniz)</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {CONCEPTS.map((cpt) => {
                  const isSelected = selectedConcepts.includes(cpt);
                  return (
                    <button
                      key={cpt}
                      type="button"
                      onClick={() => handleConceptToggle(cpt)}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        padding: '10px 18px',
                        borderRadius: '30px',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? 'var(--palm-gold)' : '#1c1611',
                        color: isSelected ? '#0d0b09' : 'var(--palm-muted)',
                        border: isSelected ? '1px solid var(--palm-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {isSelected && <Check size={14} />}
                      <span>{cpt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Contact & Couple Information with Automated Turkey Cities Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '14px', fontFamily: 'var(--font-sans)' }}>
                3. ÇİFT & İLETİŞİM BİLGİLERİ
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--palm-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>Ad Soyad (Gelin & Damat)</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Elif & Burak Kaya"
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#1c1611', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-sans)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--palm-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>Telefon / WhatsApp Numarası</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#1c1611', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-sans)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--palm-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>Tahmini Çekim / Etkinlik Tarihi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#1c1611', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-sans)' }}
                  />
                </div>

                {/* City Selection Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--palm-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>Çekim İli (Şehir Seçin)</label>
                  <select
                    value={selectedCityName}
                    onChange={(e) => handleCityChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: '#1c1611',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                    }}
                  >
                    {TURKEY_CITIES.map((c) => (
                      <option key={c.name} value={c.name} style={{ backgroundColor: '#1c1611', color: '#fff' }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Selection Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--palm-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>İlçe Seçin</label>
                  <select
                    value={selectedDistrictName}
                    onChange={(e) => setSelectedDistrictName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: '#1c1611',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                    }}
                  >
                    {currentCityObj.districts.map((dst) => (
                      <option key={dst} value={dst} style={{ backgroundColor: '#1c1611', color: '#fff' }}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Address / Venue Detail Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--palm-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>Özel Mekan / Mahalle (Opsiyonel)</label>
                  <input
                    type="text"
                    placeholder="Örn: Altınkum Sahili, Stüdyo, Kır Bahçesi..."
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#1c1611', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-sans)' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--palm-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>Eklemek İstediğiniz Notlar & Özel İstekler</label>
              <textarea
                rows={3}
                placeholder="Özel lokasyon istekleriniz, çekim detayları veya sormak istediğiniz sorular..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#1c1611', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-sans)', resize: 'vertical' }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '10px' }}>
              <button
                type="submit"
                disabled={submitting}
                className="palm-btn-gold"
                style={{
                  flex: '1 1 240px',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Send size={18} />
                <span>{submitting ? 'Gönderiliyor...' : 'Rezervasyon Talebi Gönder'}</span>
              </button>

              <a
                href={getWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="palm-btn-secondary"
                style={{
                  flex: '1 1 240px',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                }}
              >
                <MessageSquare size={18} style={{ color: 'var(--palm-gold)' }} />
                <span>WhatsApp İle Anında Fiyat Al</span>
              </a>
            </div>

          </form>
        )}

      </section>

    </div>
  );
}
