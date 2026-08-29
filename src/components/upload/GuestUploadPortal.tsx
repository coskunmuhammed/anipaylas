'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { getEventDisplayName } from '@/lib/eventUtils';
import InstagramIcon from '@/components/icons/InstagramIcon';
import AltunMedyaLogo from '@/components/palm/AltunMedyaLogo';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  X, 
  RefreshCw, 
  ArrowRight,
  Sparkles,
  ArrowLeft,
  MapPin,
  Navigation,
  ShieldCheck,
  Image as ImageIcon
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
  locationVerificationEnabled?: boolean;
  geofenceRadiusMeters?: number | null;
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

function getTurkishEventTypeLabel(type?: string): string {
  switch (type?.toUpperCase()) {
    case 'WEDDING': return 'Düğün Albümü';
    case 'ENGAGEMENT': return 'Nişan Albümü';
    case 'HENNA': return 'Kına Gecesi Albümü';
    case 'BIRTHDAY': return 'Doğum Günü Albümü';
    case 'GRADUATION': return 'Mezuniyet Albümü';
    case 'BABY_SHOWER': return 'Baby Shower Albümü';
    case 'PROMISE': return 'Söz Albümü';
    case 'CORPORATE': return 'Kurumsal Etkinlik Albümü';
    case 'PARTY': return 'Parti Albümü';
    default: return 'Dijital Anı Albümü';
  }
}

function getFriendlyLocationErrorMessage(
  errorType: 'outside' | 'denied' | 'poor_accuracy' | null, 
  rawError: string | null,
  distanceKm: string | null
): string {
  if (errorType === 'outside') {
    return distanceKm 
      ? `Etkinlik alanının dışındasınız (Yaklaşık mesafe: ${distanceKm} km). Fotoğraf yüklemek için lütfen etkinlik alanına yaklaşın.`
      : 'Etkinlik alanının dışındasınız. Fotoğraf yüklemek için lütfen etkinlik alanına yaklaşın.';
  }
  if (errorType === 'denied') {
    return 'Konum izni reddedildi. Fotoğraf paylaşmak için telefonunuzun tarayıcı ayarlarından konum erişimine izin verip tekrar deneyin.';
  }
  if (errorType === 'poor_accuracy') {
    return 'Konumunuz yeterince hassas belirlenemedi. Lütfen GPS / konum servislerinizi açıp açık bir alanda tekrar deneyin.';
  }
  if (rawError?.includes('LOCATION_NOT_VERIFIED')) {
    return 'Fotoğraf paylaşmadan önce konumunuzu doğrulamanız gerekiyor.';
  }
  return rawError || 'Konum doğrulanamadı. Lütfen tekrar deneyin.';
}

export default function GuestUploadPortal({ event, isBlocked, statusMessage }: GuestUploadPortalProps) {
  const [stage, setStage] = useState<'consent' | 'select' | 'upload' | 'complete'>('consent');
  
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  // Geofence location verification states
  const [locationVerified, setLocationVerified] = useState<boolean>(!event.locationVerificationEnabled);
  const [verifyingLocation, setVerifyingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationErrorType, setLocationErrorType] = useState<'outside' | 'denied' | 'poor_accuracy' | null>(null);
  const [approximateDistanceKm, setApproximateDistanceKm] = useState<string | null>(null);
  const [locationToken, setLocationToken] = useState<string | null>(null);

  const [filesQueue, setFilesQueue] = useState<UploadFileItem[]>([]);
  const [consentError, setConsentError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = getEventDisplayName(event);
  const landingUrl = `/etkinlik/${event.shortCode}`;
  const eventTypeLabel = getTurkishEventTypeLabel(event.eventType);

  // Geofence browser location request handler
  const handleVerifyLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }

    setVerifyingLocation(true);
    setLocationError(null);
    setLocationErrorType(null);
    setApproximateDistanceKm(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`/api/event/${event.shortCode}/verify-location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            }),
          });

          const data = await res.json();
          setVerifyingLocation(false);

          if (res.ok && data.success) {
            setLocationVerified(true);
            if (data.locationToken) {
              setLocationToken(data.locationToken);
            }
          } else {
            setLocationError(data.error || 'Konum doğrulanamadı.');
            if (data.code === 'OUTSIDE_EVENT_AREA') {
              setLocationErrorType('outside');
              setApproximateDistanceKm(data.distanceKm || null);
            } else if (data.code === 'POOR_GPS_ACCURACY') {
              setLocationErrorType('poor_accuracy');
            }
          }
        } catch (err: any) {
          setVerifyingLocation(false);
          setLocationError('Sunucu bağlantı hatası oluştu.');
        }
      },
      (err) => {
        setVerifyingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationErrorType('denied');
          setLocationError('Konum erişim izni verilmedi. Lütfen konum izinlerini açıp tekrar deneyin.');
        } else if (err.code === err.TIMEOUT) {
          setLocationError('Konum alma zaman aşımına uğradı. Lütfen tekrar deneyin.');
        } else {
          setLocationError('Konum bilgisi alınamadı.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Step 1: Consent Form Submission
  const handleProceedToUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError(null);

    if (event.guestNameRequired && !guestName.trim()) {
      setConsentError('Lütfen adınızı soyadınızı giriniz.');
      return;
    }

    if (!consentAccepted) {
      setConsentError('Lütfen KVKK şartlarını kabul ediniz.');
      return;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (locationToken) {
        headers['x-location-token'] = locationToken;
      }

      const res = await fetch('/api/event/consent', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          eventId: event.id,
          guestName: guestName.trim() || undefined,
          guestMessage: guestMessage.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.sessionToken) {
        setSessionToken(data.sessionToken);
        setStage('select');
      } else {
        setConsentError(data.error || 'Oturum başlatılamadı.');
      }
    } catch (err) {
      setConsentError('Bir ağ hatası oluştu, lütfen tekrar deneyin.');
    }
  };

  // Step 2: File Select Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const remainingSlots = event.maxPhotosPerGuest - filesQueue.length;
    if (remainingSlots <= 0) {
      alert(`En fazla ${event.maxPhotosPerGuest} fotoğraf yükleyebilirsiniz.`);
      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    const newItems: UploadFileItem[] = filesToAdd.map((file) => {
      const clientUploadId = `c_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      return {
        id: clientUploadId,
        clientUploadId,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: 'pending',
      };
    });

    setFilesQueue((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove file from queue
  const removeFile = (id: string) => {
    setFilesQueue((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  // Upload single file routine
  const uploadSingleFile = async (item: UploadFileItem): Promise<boolean> => {
    if (!sessionToken) return false;

    setFilesQueue((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading', progress: 5 } : f))
    );

    const formData = new FormData();
    formData.append('file', item.file);
    formData.append('sessionToken', sessionToken);
    formData.append('clientUploadId', item.clientUploadId);
    if (locationToken) {
      formData.append('locationToken', locationToken);
    }

    try {
      const uploadRes = await new Promise<{ success: boolean; error?: string }>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/event/upload');
        if (locationToken) {
          xhr.setRequestHeader('x-location-token', locationToken);
        }

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
    <div className="guest-wrapper">
      
      {/* Sticky Branded Palm Header */}
      <header className="palm-guest-header">
        <Link 
          href={landingUrl} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F8F6F1', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, flexShrink: 0 }}
        >
          <ArrowLeft size={16} style={{ color: '#B59A63', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap' }}>Etkinlik</span>
        </Link>

        {/* Official Palm Studio Wordmark Logo */}
        <div className="palm-brand-logo" style={{ flexShrink: 0 }}>
          <div className="palm-brand-title">
            PALM <span>STUDIO<sup>®</sup></span>
          </div>
          <div className="palm-brand-subtitle">
            DİJİTAL ANI ALBÜMÜ
          </div>
        </div>

        <div style={{ flexShrink: 0, minWidth: '40px', textAlign: 'right' }} />
      </header>

      {/* Main Container */}
      <main className="guest-container" style={{ marginTop: '20px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Event Identity Hero Card */}
        <div className="palm-editorial-card" style={{ textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div className="event-identity-badge">
            {eventTypeLabel}
          </div>
          <h1 className="event-identity-title" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {displayName}
          </h1>
          <div className="event-identity-meta">
            <span>📅 {event.eventDate}</span>
            <span>•</span>
            <span>Didim, Aydın</span>
          </div>
        </div>

        {/* Blocked Event Message */}
        {isBlocked ? (
          <div className="palm-editorial-card" style={{ textAlign: 'center', padding: '36px 24px' }}>
            <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 16px auto' }} />
            <h2 className="editorial-heading">
              Fotoğraf Yüklemesi Kapalı
            </h2>
            <p className="editorial-desc" style={{ marginBottom: '24px' }}>
              {statusMessage}
            </p>
            <Link href={landingUrl} className="palm-btn-primary" style={{ textDecoration: 'none' }}>
              <span>Etkinlik Sayfasına Dön</span>
            </Link>
          </div>
        ) : !locationVerified ? (
          /* Location Verification Experience */
          <div className="palm-editorial-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(181, 154, 99, 0.14)', 
                color: '#183D35', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 20px auto',
                border: '1px solid rgba(181, 154, 99, 0.3)'
              }}
            >
              <MapPin size={30} style={{ color: '#B59A63' }} />
            </div>

            <h2 className="editorial-heading">
              Etkinlik alanında<br />olduğunuzu doğrulayalım.
            </h2>

            <p className="editorial-desc">
              Fotoğraf paylaşımını yalnızca etkinlikte bulunan misafirlerimiz kullanabilir. Devam etmek için konumunuzu bir kez doğrulayın.
            </p>

            {locationError && (
              <div 
                style={{ 
                  padding: '14px 16px', 
                  backgroundColor: 'rgba(239, 68, 68, 0.06)', 
                  border: '1px solid rgba(239, 68, 68, 0.25)', 
                  borderRadius: '14px', 
                  color: '#991b1b', 
                  fontSize: '0.88rem', 
                  lineHeight: '1.5', 
                  marginBottom: '24px', 
                  textAlign: 'left' 
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
                  <div>
                    {getFriendlyLocationErrorMessage(locationErrorType, locationError, approximateDistanceKm)}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleVerifyLocation}
              disabled={verifyingLocation}
              className="palm-btn-primary"
            >
              {verifyingLocation ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Konumunuz Kontrol Ediliyor...</span>
                </>
              ) : (
                <>
                  <Navigation size={20} style={{ color: '#B59A63' }} />
                  <span>{locationError ? 'Konumumu Tekrar Kontrol Et' : 'Konumumu Doğrula'}</span>
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.76rem', color: '#557A67', marginTop: '16px' }}>
              <ShieldCheck size={15} style={{ color: '#B59A63' }} />
              <span>Konumunuz kaydedilmez; yalnızca alan doğrulaması için kullanılır.</span>
            </div>
          </div>
        ) : (
          <>
            {/* STAGE 1: CONSENT & DETAILS FORM */}
            {stage === 'consent' && (
              <div className="palm-editorial-card">
                <h2 className="editorial-heading">
                  {event.welcomeTitle || 'Bu geceden bir anı da siz bırakın.'}
                </h2>
                <p className="editorial-desc">
                  {event.welcomeMessage || 'Çektiğiniz fotoğrafları paylaşın, bu özel günün albümüne birlikte hayat verelim.'}
                </p>

                <form onSubmit={handleProceedToUpload} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#183D35', marginBottom: '6px' }}>
                      Adınız Soyadınız {event.guestNameRequired ? '*' : '(İsteğe Bağlı)'}
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Selin & Mert Yılmaz"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--g-border)',
                        backgroundColor: '#FFFEFB',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-sans)',
                        color: '#1E2522',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {event.guestMessageEnabled && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#183D35', marginBottom: '6px' }}>
                        Tebrik / Sevgi Notunuz
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Birkaç içten cümle ekleyebilirsiniz..."
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: '1px solid var(--g-border)',
                          backgroundColor: '#FFFEFB',
                          fontSize: '0.95rem',
                          fontFamily: 'var(--font-sans)',
                          color: '#1E2522',
                          resize: 'none',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}

                  {/* KVKK Consent Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', backgroundColor: 'rgba(248, 246, 241, 0.6)', borderRadius: '12px', border: '1px solid var(--g-border)' }}>
                    <input
                      type="checkbox"
                      id="kvkkConsent"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      style={{ marginTop: '3px', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#183D35' }}
                    />
                    <label htmlFor="kvkkConsent" style={{ fontSize: '0.82rem', color: '#557A67', lineHeight: '1.5', cursor: 'pointer' }}>
                      Yüklediğim fotoğrafların etkinlik sahibi tarafından görüntülenebileceğini ve KVKK gizlilik şartlarını kabul ediyorum.
                    </label>
                  </div>

                  {consentError && (
                    <div style={{ color: '#ef4444', fontSize: '0.88rem', fontWeight: 600, textAlign: 'center' }}>
                      {consentError}
                    </div>
                  )}

                  <button type="submit" className="palm-btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                    <span>Fotoğraf Seçimine Geç</span>
                    <ArrowRight size={18} style={{ color: '#B59A63' }} />
                  </button>
                </form>
              </div>
            )}

            {/* STAGE 2: PHOTO PICKER & SELECTION */}
            {stage === 'select' && (
              <div className="palm-editorial-card">
                <h2 className="editorial-heading">
                  Fotoğraflarınızı Seçin
                </h2>
                <p className="editorial-desc" style={{ marginBottom: '20px' }}>
                  Galerinizden bir veya birden fazla fotoğraf seçebilirsiniz (En fazla {event.maxPhotosPerGuest} adet).
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
                  className="palm-dropzone"
                >
                  <div className="palm-dropzone-icon">
                    <Camera size={26} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#183D35', marginBottom: '4px' }}>
                    + Fotoğraf Seçin
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#557A67' }}>
                    Galerinizden fotoğrafları işaretleyin
                  </div>
                </div>

                {/* 3-Column Mobile Thumbnail Grid */}
                {filesQueue.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#183D35', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Seçilen Fotoğraflar</span>
                      <span style={{ color: '#B59A63' }}>{filesQueue.length} / {event.maxPhotosPerGuest}</span>
                    </div>

                    <div className="palm-thumb-grid">
                      {filesQueue.map((item) => (
                        <div key={item.id} className="palm-thumb-item">
                          <img src={item.previewUrl} alt="Seçilen fotoğraf" />
                          <button
                            type="button"
                            onClick={() => removeFile(item.id)}
                            className="palm-thumb-remove"
                            aria-label="Kaldır"
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
                  style={{ width: '100%', marginTop: '24px' }}
                >
                  <Upload size={18} style={{ color: '#B59A63' }} />
                  <span>Fotoğrafları Albüme Ekle ({filesQueue.length})</span>
                </button>
              </div>
            )}

            {/* STAGE 3: UPLOAD PROGRESS */}
            {stage === 'upload' && (
              <div className="palm-editorial-card" style={{ textAlign: 'center' }}>
                <RefreshCw size={42} className="animate-spin" style={{ color: '#183D35', margin: '0 auto 16px auto' }} />
                <h2 className="editorial-heading">
                  Fotoğraflarınız Yüklendi...
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#557A67', fontWeight: 600, marginBottom: '20px' }}>
                  İşlenen: {filesQueue.filter((f) => f.status === 'success').length} / {filesQueue.length}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', maxHeight: '260px', overflowY: 'auto', padding: '12px', border: '1px solid var(--g-border)', borderRadius: '14px', backgroundColor: 'rgba(248, 246, 241, 0.4)' }}>
                  {filesQueue.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px', backgroundColor: '#FFFEFB', borderRadius: '10px', border: '1px solid var(--g-border)' }}>
                      <img src={item.previewUrl} alt="yükleme" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#183D35', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.file.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: item.status === 'error' ? '#ef4444' : item.status === 'success' ? '#10b981' : '#557A67' }}>
                          {item.status === 'uploading' ? `Yükleniyor %${item.progress}...` : item.status === 'success' ? 'Tamamlandı ✓' : item.status === 'error' ? item.errorMsg || 'Yüklenemedi' : 'Bekliyor'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 4: SUCCESS CONFIRMATION */}
            {stage === 'complete' && (
              <div className="palm-editorial-card" style={{ textAlign: 'center', padding: '36px 24px' }}>
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(16, 185, 129, 0.12)', 
                    color: '#10b981', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 16px auto',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <CheckCircle size={36} />
                </div>

                <h2 className="editorial-heading">
                  Anılarınız albüme eklendi.
                </h2>
                
                <p className="editorial-desc" style={{ marginBottom: '28px' }}>
                  Bu özel güne sizin gözünüzden birkaç kare daha eklendi. Teşekkür ederiz.
                </p>

                {/* Event Host Instagram */}
                {event.instagramUsername && (
                  <div style={{ padding: '16px', backgroundColor: 'rgba(248, 246, 241, 0.8)', borderRadius: '14px', border: '1px solid var(--g-border)', marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#557A67', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Etkinlik Sahibi Instagram
                    </div>
                    <a
                      href={`https://instagram.com/${event.instagramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#183D35', textDecoration: 'none' }}
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
                  >
                    + Başka Fotoğraflar Ekle
                  </button>

                  <Link href={landingUrl} className="palm-btn-primary" style={{ textDecoration: 'none' }}>
                    <span>Etkinlik Sayfasına Dön</span>
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
                      textDecoration: 'none',
                      marginTop: '8px',
                    }}
                  >
                    <Sparkles size={14} style={{ color: '#B59A63' }} />
                    <span>Palm Stüdyo’yu Keşfet &rarr;</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* Branded Footer Signature */}
      <footer className="palm-guest-footer">
        <div className="palm-footer-brand">
          PALM STUDIO<sup>®</sup>
        </div>
        <div className="palm-footer-tagline" style={{ marginBottom: '10px' }}>
          Anılarınız, birlikte.
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--palm-muted-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>Bu dijital anı deneyimi <strong>Palm Stüdyo</strong> tarafından hazırlanmıştır.</span>
          <span>·</span>
          <AltunMedyaLogo color="var(--palm-deep-green)" size={15} />
        </div>
      </footer>

    </div>
  );
}
