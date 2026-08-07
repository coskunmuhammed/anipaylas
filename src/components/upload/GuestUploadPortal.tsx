'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getEventDisplayName } from '@/lib/eventUtils';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  X, 
  RefreshCw, 
  ArrowRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface EventData {
  id: string;
  shortCode: string;
  title: string;
  eventType?: string;
  subjectType?: string;
  brideName?: string | null;
  groomName?: string | null;
  hostName?: string | null;
  instagramUsername?: string | null;
  eventDate: string;
  welcomeTitle: string;
  welcomeMessage: string;
  coverImageUrl: string | null;
  theme: string;
  guestNameRequired: boolean;
  guestMessageEnabled: boolean;
  maxPhotosPerGuest: number;
  maxPhotoSizeBytes: number;
}

interface GuestUploadPortalProps {
  event: EventData;
  isBlocked: boolean;
  statusMessage: string;
}

interface UploadFileItem {
  id: string;
  clientUploadId: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMsg?: string;
  xhr?: XMLHttpRequest;
}

export default function GuestUploadPortal({ event, isBlocked, statusMessage }: GuestUploadPortalProps) {
  const [stage, setStage] = useState<'consent' | 'select' | 'upload' | 'complete'>('consent');
  
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  const [filesQueue, setFilesQueue] = useState<UploadFileItem[]>([]);
  const [consentError, setConsentError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = getEventDisplayName(event);
  const landingUrl = `/etkinlik/${event.shortCode}`;

  // Step 1: Submit Consent & Create Session
  const handleProceedToUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError(null);

    if (event.guestNameRequired && !guestName.trim()) {
      setConsentError('Lütfen adınızı girin.');
      return;
    }

    if (!consentAccepted) {
      setConsentError('Devam etmek için KVKK ve veri kullanım şartlarını onaylamalısınız.');
      return;
    }

    try {
      const res = await fetch('/api/event/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          guestName: guestName.trim() || 'Anonim Misafir',
          guestMessage: guestMessage.trim(),
          consentTextVersion: 'v1.0',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setConsentError(data.error || 'Oturum oluşturulamadı.');
      } else {
        setSessionToken(data.sessionToken);
        setStage('select');
      }
    } catch (err) {
      setConsentError('Bağlantı hatası oluştu.');
    }
  };

  // Step 2: Handle File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);
    const newItems: UploadFileItem[] = [];

    for (const file of selectedFiles) {
      // Validate video rejection
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const isHeic = fileExt === 'heic' || fileExt === 'heif';
      if (!file.type.startsWith('image/') && !isHeic) {
        alert(`"${file.name}" bir fotoğraf dosyası değil. Videolar yüklenemez.`);
        continue;
      }

      if (file.size > event.maxPhotoSizeBytes) {
        alert(`"${file.name}" boyutu sınırı (${Math.round(event.maxPhotoSizeBytes / 1024 / 1024)}MB) aşıyor.`);
        continue;
      }

      const itemId = Math.random().toString(36).substring(2, 9);
      newItems.push({
        id: itemId,
        clientUploadId: `guest-${itemId}-${Date.now()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: 'pending',
      });
    }

    if (filesQueue.length + newItems.length > event.maxPhotosPerGuest) {
      alert(`Maksimum ${event.maxPhotosPerGuest} fotoğraf yükleyebilirsiniz.`);
      return;
    }

    setFilesQueue((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFilesQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const uploadSingleFile = async (item: UploadFileItem) => {
    if (!sessionToken) return false;

    setFilesQueue((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading', progress: 10, errorMsg: undefined } : f))
    );

    const formData = new FormData();
    formData.append('photo', item.file);
    formData.append('sessionToken', sessionToken);
    formData.append('clientUploadId', item.clientUploadId);
    if (guestMessage) formData.append('guestMessage', guestMessage);

    try {
      const uploadRes = await new Promise<{ success: boolean; error?: string }>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/event/upload');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setFilesQueue((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, progress: percent } : f))
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve({ success: true });
          } else {
            try {
              const parsed = JSON.parse(xhr.responseText);
              resolve({ success: false, error: parsed.error });
            } catch {
              resolve({ success: false, error: 'Yükleme başarısız' });
            }
          }
        };

        xhr.onerror = () => resolve({ success: false, error: 'Ağ hatası' });
        xhr.send(formData);
      });

      if (uploadRes.success) {
        setFilesQueue((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'success', progress: 100 } : f))
        );
        return true;
      } else {
        setFilesQueue((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'error', errorMsg: uploadRes.error } : f))
        );
        return false;
      }
    } catch (err) {
      setFilesQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'error', errorMsg: 'Hata oluştu' } : f))
      );
      return false;
    }
  };

  // Step 3: Start Batch Upload Process with Parallel Concurrency Pool = 3
  const startBatchUpload = async () => {
    if (!sessionToken) return;
    setStage('upload');

    const pendingItems = filesQueue.filter((item) => item.status !== 'success');
    const CONCURRENCY = 3;
    let index = 0;

    const worker = async () => {
      while (index < pendingItems.length) {
        const item = pendingItems[index++];
        if (item) {
          await uploadSingleFile(item);
        }
      }
    };

    const workers = Array.from({ length: Math.min(CONCURRENCY, pendingItems.length) }, () => worker());
    await Promise.all(workers);

    setStage('complete');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F6F1', color: '#1E2522', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <header style={{ padding: '16px 24px', backgroundColor: '#183D35', color: '#F8F6F1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href={landingUrl} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F8F6F1', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={18} />
          <span>Etkinlik Sayfasına Dön</span>
        </Link>
        <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B59A63', fontWeight: 700 }}>
          PALM STÜDYO DİJİTAL ANI ALBÜMÜ
        </div>
      </header>

      {/* Main Form Container */}
      <main style={{ flex: 1, maxWidth: '640px', width: '100%', margin: '40px auto', padding: '0 20px' }}>
        
        {/* Event Header Banner */}
        <div className="palm-card" style={{ marginBottom: '24px', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#557A67', fontWeight: 700, marginBottom: '6px' }}>
            {event.eventType || 'ETKİNLİK'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: '#183D35', marginBottom: '8px' }}>
            {displayName}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>{event.eventDate}</p>
        </div>

        {/* Blocked Event Message */}
        {isBlocked ? (
          <div className="palm-card" style={{ textAlign: 'center', backgroundColor: '#ffffff' }}>
            <AlertCircle size={48} style={{ color: '#b91c1c', margin: '0 auto 16px auto' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#183D35', marginBottom: '12px' }}>
              Yükleme Kapalı
            </h2>
            <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {statusMessage}
            </p>
            <Link href={landingUrl} className="palm-btn-primary">
              Etkinlik Sayfasına Dön
            </Link>
          </div>
        ) : (
          <>
            {/* STAGE 1: CONSENT FORM */}
            {stage === 'consent' && (
              <div className="palm-card" style={{ backgroundColor: '#ffffff' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: '#183D35', marginBottom: '12px', textAlign: 'center' }}>
                  {event.welcomeTitle || 'Anılarınızı Paylaşın'}
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6', marginBottom: '28px', textAlign: 'center' }}>
                  {event.welcomeMessage || 'Çektiğiniz güzel fotoğrafları yükleyerek düğün albümüne katkıda bulunun.'}
                </p>

                <form onSubmit={handleProceedToUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#183D35', marginBottom: '6px' }}>
                      Adınız Soyadınız {event.guestNameRequired ? '*' : '(Zorunlu Değil)'}
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Ayşe & Can Yılmaz"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--palm-border)',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-sans)',
                      }}
                    />
                  </div>

                  {event.guestMessageEnabled && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#183D35', marginBottom: '6px' }}>
                        Çiftimize / Etkinlik Sahibine Notunuz
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Birkaç tatlı mesaj bırakın..."
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid var(--palm-border)',
                          fontSize: '0.95rem',
                          fontFamily: 'var(--font-sans)',
                          resize: 'none',
                        }}
                      />
                    </div>
                  )}

                  {/* KVKK Consent Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', backgroundColor: 'var(--palm-offwhite)', borderRadius: '12px' }}>
                    <input
                      type="checkbox"
                      id="kvkkConsent"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      style={{ marginTop: '3px', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="kvkkConsent" style={{ fontSize: '0.82rem', color: '#4a5568', lineHeight: '1.5', cursor: 'pointer' }}>
                      Yüklediğim fotoğrafların etkinlik sahibi tarafından indirilebileceğini, saklanabileceğini ve KVKK veri şartlarını kabul ediyorum.
                    </label>
                  </div>

                  {consentError && (
                    <div style={{ color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                      {consentError}
                    </div>
                  )}

                  <button type="submit" className="palm-btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    <span>Fotoğraf Seçimine Geç</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* STAGE 2: FILE SELECTION */}
            {stage === 'select' && (
              <div className="palm-card" style={{ backgroundColor: '#ffffff' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: '#183D35', marginBottom: '8px', textAlign: 'center' }}>
                  Fotoğraflarınızı Seçin
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#557A67', textAlign: 'center', marginBottom: '24px' }}>
                  En fazla {event.maxPhotosPerGuest} fotoğraf yükleyebilirsiniz.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                  multiple
                  style={{ display: 'none' }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #B59A63',
                    backgroundColor: 'rgba(181, 154, 99, 0.05)',
                    borderRadius: '16px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    transition: 'all 0.2s',
                  }}
                >
                  <Camera size={44} style={{ color: '#183D35', marginBottom: '12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#183D35', marginBottom: '4px' }}>
                    Fotoğraf Seçin veya Dokunun
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    JPEG, PNG, WEBP veya HEIC formatları desteklenir.
                  </div>
                </div>

                {/* Queue Preview List */}
                {filesQueue.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#183D35', marginBottom: '12px' }}>
                      Seçilen Fotoğraflar ({filesQueue.length})
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px' }}>
                      {filesQueue.map((item) => (
                        <div key={item.id} style={{ position: 'relative', height: '90px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--palm-border)' }}>
                          <img src={item.previewUrl} alt="Seçim" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            onClick={() => removeFile(item.id)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              color: '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  disabled={filesQueue.length === 0}
                  onClick={startBatchUpload}
                  className="palm-btn-primary"
                  style={{ width: '100%', opacity: filesQueue.length === 0 ? 0.5 : 1 }}
                >
                  <Upload size={18} />
                  <span>Fotoğrafları Yükle ({filesQueue.length})</span>
                </button>
              </div>
            )}

            {/* STAGE 3: UPLOAD PROGRESS */}
            {stage === 'upload' && (
              <div className="palm-card" style={{ textAlign: 'center', backgroundColor: '#ffffff' }}>
                <RefreshCw size={40} className="animate-spin" style={{ color: '#183D35', margin: '0 auto 16px auto' }} />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#183D35', marginBottom: '8px' }}>
                  Fotoğraflar Yükleniyor...
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#557A67', marginBottom: '20px', fontWeight: 600 }}>
                  Yüklenen: {filesQueue.filter((f) => f.status === 'success').length} / {filesQueue.length}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', maxHeight: '240px', overflowY: 'auto', padding: '10px', border: '1px solid var(--palm-border)', borderRadius: '12px', marginBottom: '16px' }}>
                  {filesQueue.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', padding: '6px', backgroundColor: 'var(--palm-offwhite)', borderRadius: '8px' }}>
                      <img src={item.previewUrl} alt="yükleme" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, color: '#183D35' }}>{item.file.name}</div>
                        <div style={{ fontSize: '0.75rem', color: item.status === 'error' ? '#b91c1c' : item.status === 'success' ? '#15803d' : '#4a5568' }}>
                          {item.status === 'uploading' ? `Yükleniyor %${item.progress}...` : item.status === 'success' ? 'Tamamlandı ✓' : item.status === 'error' ? item.errorMsg || 'Hata' : 'Sırada'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 4: COMPLETE SUCCESS */}
            {stage === 'complete' && (
              <div className="palm-card" style={{ textAlign: 'center', backgroundColor: '#ffffff' }}>
                <CheckCircle size={56} style={{ color: '#15803d', margin: '0 auto 16px auto' }} />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: '#183D35', marginBottom: '12px' }}>
                  🎉 Fotoğraflarınız Yüklendi!
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6', marginBottom: '32px' }}>
                  Bu özel günün en güzel anılarını paylaştığınız için teşekkür ederiz. Fotoğraflarınız Palm Stüdyo Dijital Anı Albümü’ne başarıyla eklendi.
                </p>

                {/* Clear UI separation between Event Owner Instagram vs Palm Studio Instagram */}
                {event.instagramUsername && (
                  <div style={{ padding: '16px', backgroundColor: 'var(--palm-surface-light)', borderRadius: '16px', marginBottom: '24px', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#557A67', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Etkinlik Sahibi Instagram Hesabı
                    </div>
                    <a
                      href={`https://instagram.com/${event.instagramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#183D35' }}
                    >
                      <InstagramIcon size={18} />
                      <span>@{event.instagramUsername}</span>
                    </a>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setFilesQueue([]);
                      setStage('select');
                    }}
                    className="palm-btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Yeni Fotoğraf Yükle
                  </button>

                  <Link href={landingUrl} className="palm-btn-primary" style={{ width: '100%' }}>
                    Etkinlik Sayfasına Dön
                  </Link>

                  <Link
                    href="/"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#557A67',
                      marginTop: '12px',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Palm Stüdyo’yu Keşfet &rarr;</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Branding */}
      <footer style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        Bu dijital anı deneyimi Palm Stüdyo tarafından hazırlanmıştır.
      </footer>
    </div>
  );
}
