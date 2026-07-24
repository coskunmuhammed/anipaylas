'use client';

import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  X, 
  RefreshCw, 
  ArrowRight
} from 'lucide-react';
import { getEventDisplayName } from '@/lib/eventUtils';

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

interface EventData {
  id: string;
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
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMsg?: string;
  xhr?: XMLHttpRequest;
}

export default function GuestUploadPortal({ event, isBlocked, statusMessage }: GuestUploadPortalProps) {
  // Stage state: 'consent' | 'select' | 'upload' | 'complete'
  const [stage, setStage] = useState<'consent' | 'select' | 'upload' | 'complete'>('consent');
  
  // Form input state
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  // File Queue State
  const [filesQueue, setFilesQueue] = useState<UploadFileItem[]>([]);
  const [consentError, setConsentError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply Theme class
  const getThemeClass = (theme: string) => {
    if (theme === 'romantic') return 'theme-romantic';
    if (theme === 'elegant') return 'theme-elegant';
    if (theme === 'modern') return 'theme-modern';
    return 'theme-default';
  };

  const displayName = getEventDisplayName(event);

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
      console.error(err);
      setConsentError('Oturum oluşturulurken bir ağ hatası oluştu.');
    }
  };

  // Step 2: Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    
    // Check maximum single batch select (max 20)
    if (selectedFiles.length > 20) {
      alert('Tek seferde en fazla 20 fotoğraf seçebilirsiniz.');
      return;
    }

    // Process files
    const newItems: UploadFileItem[] = [];
    let overSizeLimit = false;

    selectedFiles.forEach((file) => {
      // Validate file size
      if (file.size > event.maxPhotoSizeBytes) {
        overSizeLimit = true;
        return;
      }

      // Check format
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const isHeic = fileExt === 'heic' || fileExt === 'heif';
      
      if (!validTypes.includes(file.type) && !isHeic) {
        return; // Skip invalid format
      }

      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: 'pending',
      });
    });

    if (overSizeLimit) {
      alert(`Fotoğraf boyutu ${event.maxPhotoSizeBytes / 1024 / 1024}MB sınırını aşamaz.`);
    }

    if (newItems.length > 0) {
      setFilesQueue((prev) => [...prev, ...newItems]);
    }
  };

  const removeQueueItem = (id: string) => {
    setFilesQueue((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  // Step 3: Trigger uploads
  const startUploads = () => {
    if (filesQueue.length === 0) return;
    setStage('upload');
    filesQueue.forEach((item) => {
      if (item.status === 'pending' || item.status === 'error') {
        uploadFile(item.id);
      }
    });
  };

  // Helper function to compress image
  async function compressImageForUpload(file: File): Promise<File> {
    const isHeic = file.name.match(/\.(heic|heif)$/i);
    if (file.size <= 1.5 * 1024 * 1024 && !isHeic) {
      return file;
    }

    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        let width = img.width;
        let height = img.height;
        const maxDim = 2048;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.88
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };

      img.src = url;
    });
  }

  const uploadFile = async (id: string) => {
    const queueItem = filesQueue.find((x) => x.id === id);
    if (!queueItem || !sessionToken) return;

    setFilesQueue((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: 'uploading', progress: 5 } : x))
    );

    try {
      const fileToSend = await compressImageForUpload(queueItem.file);

      const formData = new FormData();
      formData.append('photo', fileToSend);
      formData.append('sessionToken', sessionToken);
      formData.append('guestName', guestName.trim() || 'Anonim Misafir');
      formData.append('guestMessage', guestMessage.trim());

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded / e.total) * 100);
          setFilesQueue((prev) =>
            prev.map((x) => (x.id === id ? { ...x, progress: Math.max(10, percentage) } : x))
          );
        }
      });

      xhr.addEventListener('load', () => {
        let response: { success?: boolean; error?: string } | null = null;
        try {
          response = JSON.parse(xhr.responseText);
        } catch {}
        
        if (xhr.status >= 200 && xhr.status < 300 && response?.success) {
          setFilesQueue((prev) =>
            prev.map((x) => (x.id === id ? { ...x, status: 'success', progress: 100 } : x))
          );
          checkAllUploadsFinished();
        } else {
          let errorMsg = response?.error;
          if (!errorMsg) {
            if (xhr.status === 413) errorMsg = 'Dosya boyutu sunucu sınırını aşıyor.';
            else if (xhr.status === 403) errorMsg = 'Yükleme kapalı.';
            else errorMsg = 'Yükleme başarısız.';
          }
          setFilesQueue((prev) =>
            prev.map((x) => (x.id === id ? { ...x, status: 'error', errorMsg } : x))
          );
        }
      });

      xhr.addEventListener('error', () => {
        setFilesQueue((prev) =>
          prev.map((x) => (x.id === id ? { ...x, status: 'error', errorMsg: 'Bağlantı hatası.' } : x))
        );
      });

      xhr.open('POST', '/api/event/upload');
      xhr.send(formData);

      setFilesQueue((prev) =>
        prev.map((x) => (x.id === id ? { ...x, xhr } : x))
      );
    } catch (err: unknown) {
      console.error('File prep error:', err);
      setFilesQueue((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: 'error', errorMsg: 'Görsel hazırlanamadı.' } : x))
      );
    }
  };

  const retryUpload = (id: string) => {
    uploadFile(id);
  };

  const checkAllUploadsFinished = () => {
    setTimeout(() => {
      setFilesQueue((currentQueue) => {
        const hasActive = currentQueue.some((x) => x.status === 'uploading' || x.status === 'pending');
        const hasError = currentQueue.some((x) => x.status === 'error');
        const hasSuccess = currentQueue.some((x) => x.status === 'success');
        
        if (!hasActive && hasSuccess && !hasError) {
          setStage('complete');
        }
        return currentQueue;
      });
    }, 500);
  };

  const handleUploadMore = () => {
    setFilesQueue([]);
    setStage('select');
  };

  const handleResetToLanding = () => {
    setFilesQueue([]);
    setStage('consent');
  };

  // Blocked Event layout
  if (isBlocked) {
    return (
      <div className={`guest-wrapper ${getThemeClass(event.theme)}`}>
        <div className="guest-container">
          <div className="guest-cover">
            {event.coverImageUrl && (
              <img 
                src={event.coverImageUrl}
                alt="event cover" 
              />
            )}
          </div>
          <div className="guest-header">
            <h1 className="couple-names">{displayName}</h1>
            <div className="wedding-date">{event.eventDate}</div>
          </div>
          <div className="blocked-screen">
            <div className="blocked-icon">
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontWeight: 700 }}>Fotoğraf Yükleme Kapalı</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--g-text-muted)', lineHeight: '1.5' }}>
              {statusMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`guest-wrapper ${getThemeClass(event.theme)}`}>
      <div className="guest-container">
        
        {/* Banner Cover Image */}
        <div className="guest-cover">
          {event.coverImageUrl && (
            <img 
              src={event.coverImageUrl}
              alt="cover banner" 
            />
          )}
        </div>

        {/* Header Names */}
        <div className="guest-header">
          <h1 className="couple-names">{displayName}</h1>
          <div className="wedding-date">{event.eventDate}</div>
        </div>

        {/* Stage 1: Consent, Name and Message */}
        {stage === 'consent' && (
          <>
            <div className="welcome-box">
              <h2 className="welcome-title">{event.welcomeTitle}</h2>
              <p className="welcome-desc">{event.welcomeMessage}</p>
            </div>

            <div className="guest-card">
              <form onSubmit={handleProceedToUpload}>
                <div className="g-form-group">
                  <label htmlFor="g-name">
                    Adınız Soyadınız {event.guestNameRequired && <span style={{ color: 'var(--g-danger)' }}>*</span>}
                  </label>
                  <input
                    id="g-name"
                    type="text"
                    className="g-control"
                    placeholder="örn: Ahmet Yılmaz"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required={event.guestNameRequired}
                  />
                </div>

                {event.guestMessageEnabled && (
                  <div className="g-form-group">
                    <label htmlFor="g-msg">Tebrik Mesajınız (İsteğe Bağlı)</label>
                    <textarea
                      id="g-msg"
                      className="g-control"
                      placeholder="Güzel dileklerinizi yazın..."
                      rows={3}
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                    />
                  </div>
                )}

                <div className="g-form-group" style={{ marginTop: '20px' }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      required
                    />
                    <span>
                      Etkinlik albümüne yükleyeceğim fotoğrafların platform yöneticisi tarafından onaylanmasını, indirme paketi olarak sunulmasını ve KVKK kapsamında işlenmesini onaylıyorum.
                    </span>
                  </label>
                </div>

                {consentError && (
                  <div style={{ color: 'var(--g-danger)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '14px', fontWeight: 600 }}>
                    {consentError}
                  </div>
                )}

                <button type="submit" className="g-btn g-btn-primary">
                  Devam Et ve Fotoğraf Seç
                </button>
              </form>
            </div>
          </>
        )}

        {/* Stage 2: Select Photos */}
        {stage === 'select' && (
          <div className="guest-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
              Fotoğrafları Seçin
            </h3>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/jpg, image/png, image/webp, image/heic, image/heif"
              multiple
              style={{ display: 'none' }}
            />

            <div 
              className="upload-btn-container"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                <Camera size={26} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Fotoğraf Çek veya Galeriden Seç</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--g-text-muted)', marginTop: '6px' }}>
                Desteklenen formatlar: JPG, PNG, WebP, HEIC (Maks {event.maxPhotoSizeBytes / 1024 / 1024}MB)
              </p>
            </div>

            {/* Selected File Previews */}
            {filesQueue.length > 0 && (
              <>
                <div className="preview-grid">
                  {filesQueue.map((item) => (
                    <div key={item.id} className="preview-item">
                      <img src={item.previewUrl} alt="selected preview" />
                      <button 
                        onClick={() => removeQueueItem(item.id)} 
                        className="preview-remove"
                        type="button"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px' }}>
                  <button onClick={startUploads} className="g-btn g-btn-primary">
                    <Upload size={18} />
                    <span>{filesQueue.length} Fotoğrafı Yükle</span>
                  </button>
                </div>
              </>
            )}

            <button 
              onClick={() => setStage('consent')} 
              className="g-btn" 
              style={{ marginTop: '12px', color: 'var(--g-text-muted)', backgroundColor: 'transparent' }}
            >
              Bilgileri Güncelle
            </button>
          </div>
        )}

        {/* Stage 3: Real-Time Upload Queue Progress */}
        {stage === 'upload' && (
          <div className="guest-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
              Fotoğraflar Yükleniyor
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--g-text-muted)', textAlign: 'center', marginBottom: '20px' }}>
              Lütfen yükleme işlemi bitene kadar bu sayfayı kapatmayın.
            </p>

            <div className="upload-queue">
              {filesQueue.map((item) => (
                <div key={item.id} className="queue-item">
                  <div className="queue-thumb">
                    <img src={item.previewUrl} alt="thumbnail" />
                  </div>
                  
                  <div className="queue-info">
                    <div className="queue-name">{item.file.name}</div>
                    
                    {item.status === 'uploading' && (
                      <div className="queue-progress">
                        <div 
                          className="queue-progress-bar" 
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                    
                    <div className="queue-status">
                      {item.status === 'pending' && <span style={{ color: 'var(--g-text-muted)' }}>Sırada...</span>}
                      {item.status === 'uploading' && <span style={{ color: 'var(--g-primary)' }}>Yükleniyor %{item.progress}...</span>}
                      {item.status === 'success' && <span style={{ color: 'var(--g-success)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={10} /> Yüklendi</span>}
                      {item.status === 'error' && <span style={{ color: 'var(--g-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={10} /> Hata: {item.errorMsg}</span>}
                    </div>
                  </div>

                  {item.status === 'error' && (
                    <button 
                      onClick={() => retryUpload(item.id)} 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '6px' }}
                      title="Yeniden Dene"
                    >
                      <RefreshCw size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {filesQueue.some(x => x.status === 'error') && !filesQueue.some(x => x.status === 'uploading') && (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => {
                    filesQueue.forEach(item => {
                      if (item.status === 'error') retryUpload(item.id);
                    });
                  }} 
                  className="g-btn g-btn-primary"
                >
                  <RefreshCw size={16} />
                  <span>Başarısız Olanları Yeniden Dene</span>
                </button>
                <button 
                  onClick={handleUploadMore} 
                  className="g-btn" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--g-text)' }}
                >
                  Yenilerini Ekle
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stage 4: Success Complete Screen (Updated Requirement 1 & 2) */}
        {stage === 'complete' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Primary Success Card */}
            <div className="guest-card success-screen">
              <div className="success-icon">
                <CheckCircle size={36} />
              </div>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>🎉 Fotoğraflarınız başarıyla yüklendi!</h2>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--g-text-muted)', lineHeight: '1.5', marginTop: '8px' }}>
                Bu özel günün en güzel anılarını bizimle paylaştığınız için teşekkür ederiz. Yüklediğiniz fotoğraflar güvenli bir şekilde etkinlik albümüne eklendi.
              </p>
            </div>

            {/* Secondary Action Card */}
            <div className="guest-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                📷 Daha fazla fotoğrafın var mı?
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--g-text-muted)', marginBottom: '16px' }}>
                Gün boyunca çektiğin diğer güzel kareleri de bizimle paylaşabilirsin.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={handleUploadMore} 
                  className="g-btn g-btn-primary"
                >
                  Yeni Fotoğraf Yükle
                </button>
                <button 
                  onClick={handleResetToLanding} 
                  className="g-btn"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--g-text)' }}
                >
                  Etkinlik Sayfasına Dön
                </button>
              </div>
            </div>

            {/* Optional Instagram Card (Requirement 2 & 5) */}
            {event.instagramUsername && (
              <div className="guest-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.08) 0%, rgba(131, 58, 180, 0.08) 100%)', border: '1px solid rgba(225, 48, 108, 0.2)' }}>
                <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff', marginBottom: '10px' }}>
                  <InstagramIcon size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                  📲 Instagram&apos;da bizi takip etmeyi unutmayın.
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--g-text-muted)', marginBottom: '14px' }}>
                  @{event.instagramUsername} hesabını takip edin.
                </p>

                <a 
                  href={`https://instagram.com/${event.instagramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="g-btn"
                  style={{ 
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Instagram&apos;a Git</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
