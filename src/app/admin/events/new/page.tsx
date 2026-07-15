'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  QrCode, 
  Edit3, 
  List, 
  Plus, 
  Check 
} from 'lucide-react';

interface CreatedEventData {
  id: string;
  title: string;
  shortCode: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  venueName: string;
  city: string;
  district: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdEvent, setCreatedEvent] = useState<CreatedEventData | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('23:00');
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  
  // Customization
  const [welcomeTitle, setWelcomeTitle] = useState('Düğün Albümümüze Hoş Geldiniz');
  const [welcomeMessage, setWelcomeMessage] = useState('Bu özel günümüzde çektiğiniz güzel anları bizimle paylaşın. Yüklediğiniz her fotoğraf, yıllar sonra tekrar bakacağımız değerli bir hatıra olacak.');
  const [theme, setTheme] = useState('default');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  // Settings & Rules
  const [status, setStatus] = useState('ACTIVE');
  const [moderationEnabled, setModerationEnabled] = useState(true);
  const [guestNameRequired, setGuestNameRequired] = useState(false);
  const [guestMessageEnabled, setGuestMessageEnabled] = useState(true);

  // Limits
  const [uploadStartsAt, setUploadStartsAt] = useState('');
  const [uploadEndsAt, setUploadEndsAt] = useState('');
  const [maxPhotosPerGuest, setMaxPhotosPerGuest] = useState(50);
  const [maxPhotoSizeMB, setMaxPhotoSizeMB] = useState(15);
  const [maxTotalPhotos, setMaxTotalPhotos] = useState(1000);
  const [maxStorageGB, setMaxStorageGB] = useState(10);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCopyGuestLink = (shortCode: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const guestUrl = `${origin}/event/${shortCode}`;
    navigator.clipboard.writeText(guestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const resetForm = () => {
    setTitle('');
    setBrideName('');
    setGroomName('');
    setEventDate('');
    setVenueName('');
    setCity('');
    setDistrict('');
    setCoverImage(null);
    setCoverImagePreview(null);
    setCreatedEvent(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('brideName', brideName);
      formData.append('groomName', groomName);
      formData.append('eventDate', eventDate);
      formData.append('startTime', startTime);
      formData.append('endTime', endTime);
      formData.append('venueName', venueName);
      formData.append('city', city);
      formData.append('district', district);
      formData.append('welcomeTitle', welcomeTitle);
      formData.append('welcomeMessage', welcomeMessage);
      formData.append('theme', theme);
      formData.append('status', status);
      formData.append('moderationEnabled', String(moderationEnabled));
      formData.append('guestNameRequired', String(guestNameRequired));
      formData.append('guestMessageEnabled', String(guestMessageEnabled));
      
      // Calculate times safely
      let startDateTime = uploadStartsAt;
      if (!startDateTime && eventDate) {
        startDateTime = `${eventDate}T${startTime || '19:00'}`;
      }
      let endDateTime = uploadEndsAt;
      if (!endDateTime && eventDate) {
        endDateTime = `${eventDate}T${endTime || '23:00'}`;
      }

      formData.append('uploadStartsAt', startDateTime ? new Date(startDateTime).toISOString() : new Date().toISOString());
      formData.append('uploadEndsAt', endDateTime ? new Date(endDateTime).toISOString() : new Date(Date.now() + 86400000).toISOString());
      
      formData.append('maxPhotosPerGuest', String(maxPhotosPerGuest));
      formData.append('maxPhotoSizeBytes', String(maxPhotoSizeMB * 1024 * 1024));
      formData.append('maxTotalPhotos', String(maxTotalPhotos));
      formData.append('maxStorageBytes', String(maxStorageGB * 1024 * 1024 * 1024));
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const res = await fetch('/api/admin/events/create', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Etkinlik oluşturulurken bir hata oluştu.');
      } else {
        if (data.event) {
          setCreatedEvent(data.event);
        } else {
          setCreatedEvent({
            id: data.eventId,
            title,
            shortCode: 'ETKINLIK',
            brideName,
            groomName,
            eventDate,
            venueName,
            city,
            district
          });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
      setError('Ağ hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin/events" className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Yeni Düğün Etkinliği</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Yeni bir salon, QR kod ve albüm oluşturmak için aşağıdaki detayları doldurun.
            </p>
          </div>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1: Temel Bilgiler */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Düğün Temel Bilgileri
          </h3>
          
          <div className="form-group">
            <label htmlFor="title">Etkinlik Adı (örn: Ayşe & Mustafa Düğün Albümü)</label>
            <input
              id="title"
              type="text"
              className="form-control"
              placeholder="Ayşe & Mustafa Düğün Hatırası"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brideName">Gelin Adı</label>
              <input
                id="brideName"
                type="text"
                className="form-control"
                placeholder="Ayşe"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="groomName">Damat Adı</label>
              <input
                id="groomName"
                type="text"
                className="form-control"
                placeholder="Mustafa"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Etkinlik Tarihi</label>
              <input
                id="eventDate"
                type="date"
                className="form-control"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div className="form-row" style={{ gap: '10px' }}>
              <div className="form-group">
                <label htmlFor="startTime">Başlangıç Saati</label>
                <input
                  id="startTime"
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endTime">Bitiş Saati</label>
                <input
                  id="endTime"
                  type="time"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2 / span 2' }}>
              <label htmlFor="venueName">Düğün Salonu / Mekân Adı</label>
              <input
                id="venueName"
                type="text"
                className="form-control"
                placeholder="Kırçiçeği Düğün Davet Salonu"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Şehir</label>
              <input
                id="city"
                type="text"
                className="form-control"
                placeholder="İstanbul"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="district">İlçe</label>
              <input
                id="district"
                type="text"
                className="form-control"
                placeholder="Kadıköy"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Karşılama ve Tema Ayarları */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Misafir Karşılama Sayfası Ayarları
          </h3>

          <div className="form-group">
            <label htmlFor="welcomeTitle">Karşılama Başlığı</label>
            <input
              id="welcomeTitle"
              type="text"
              className="form-control"
              value={welcomeTitle}
              onChange={(e) => setWelcomeTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="welcomeMessage">Karşılama Mesajı</label>
            <textarea
              id="welcomeMessage"
              className="form-control"
              rows={4}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="theme">Arayüz Teması</label>
              <select
                id="theme"
                className="form-control"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="default">Premium Koyu Slate (Varsayılan)</option>
                <option value="romantic">Gül Rengi Romantik</option>
                <option value="elegant">Zarif Altın & Krem</option>
                <option value="modern">Modern Minimal Beyaz</option>
              </select>
            </div>

            <div className="form-group">
              <label>Kapak Fotoğrafı</label>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '15px', 
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-color)'
                }}
              >
                <div 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: 'var(--radius-sm)', 
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  {coverImagePreview ? (
                    <img src={coverImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ fontSize: '0.8rem' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG, WebP. Maks 5MB.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '10px' }}>
            <div className="form-switch">
              <div>
                <div style={{ fontWeight: 600 }}>Fotoğraf Moderasyonu</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fotoğraflar onayınızdan sonra albüme eklenir.</div>
              </div>
              <input
                type="checkbox"
                checked={moderationEnabled}
                onChange={(e) => setModerationEnabled(e.target.checked)}
              />
            </div>

            <div className="form-switch">
              <div>
                <div style={{ fontWeight: 600 }}>Misafir İsmi Zorunlu</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ziyaretçiler fotoğraf yüklerken adını yazmalıdır.</div>
              </div>
              <input
                type="checkbox"
                checked={guestNameRequired}
                onChange={(e) => setGuestNameRequired(e.target.checked)}
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '10px' }}>
            <div className="form-switch" style={{ gridColumn: 'span 1' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Misafir Mesajı</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ziyaretçiler tebrik mesajı bırakabilirler.</div>
              </div>
              <input
                type="checkbox"
                checked={guestMessageEnabled}
                onChange={(e) => setGuestMessageEnabled(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Sınırlar ve Limitler */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Fotoğraf Yükleme Limitleri & Kota
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxPhotosPerGuest">Tek Misafir Maksimum Fotoğraf Sayısı</label>
              <input
                id="maxPhotosPerGuest"
                type="number"
                className="form-control"
                value={maxPhotosPerGuest}
                onChange={(e) => setMaxPhotosPerGuest(parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="maxPhotoSizeMB">Tek Fotoğraf Maksimum Boyutu (MB)</label>
              <input
                id="maxPhotoSizeMB"
                type="number"
                className="form-control"
                value={maxPhotoSizeMB}
                onChange={(e) => setMaxPhotoSizeMB(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxTotalPhotos">Düğün İçin Toplam Fotoğraf Sınırı</label>
              <input
                id="maxTotalPhotos"
                type="number"
                className="form-control"
                value={maxTotalPhotos}
                onChange={(e) => setMaxTotalPhotos(parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="maxStorageGB">Düğün Toplam Depolama Kotası (GB)</label>
              <input
                id="maxStorageGB"
                type="number"
                className="form-control"
                value={maxStorageGB}
                onChange={(e) => setMaxStorageGB(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Zamanlama & Yayın Durumu */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Zamanlama ve Etkinlik Durumu
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="uploadStartsAt">Yükleme Başlangıç Tarih & Saati (Boş bırakılırsa düğün saatinde başlar)</label>
              <input
                id="uploadStartsAt"
                type="datetime-local"
                className="form-control"
                value={uploadStartsAt}
                onChange={(e) => setUploadStartsAt(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="uploadEndsAt">Yükleme Bitiş Tarih & Saati (Boş bırakılırsa düğünden 1 gün sonra biter)</label>
              <input
                id="uploadEndsAt"
                type="datetime-local"
                className="form-control"
                value={uploadEndsAt}
                onChange={(e) => setUploadEndsAt(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Etkinlik Durumu</label>
            <select
              id="status"
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="DRAFT">Taslak (Yükleme yapılamaz)</option>
              <option value="PLANNED">Planlandı (Zamanı geldiğinde aktifleşir)</option>
              <option value="ACTIVE">Aktif (Yükleme yapılabilir)</option>
              <option value="CLOSED_FOR_UPLOAD">Fotoğraf Yüklemeye Kapalı</option>
              <option value="ALBUM_PREPARATION">Albüm Hazırlanıyor</option>
              <option value="READY_FOR_DOWNLOAD">İndirmeye Hazır</option>
              <option value="ARCHIVED">Arşivlendi</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <Link href="/admin/events" className="btn btn-secondary">
            İptal Et
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} />
            <span>{loading ? 'Kaydediliyor...' : 'Etkinliği Kaydet'}</span>
          </button>
        </div>

      </form>

      {/* Success Popup Modal */}
      {createdEvent && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 8, 16, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div 
            style={{
              backgroundColor: '#111726',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '24px',
              maxWidth: '620px',
              width: '100%',
              padding: '36px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.25)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Animated Check Icon */}
            <div 
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Düğün Etkinliği Başarıyla Oluşturuldu!
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Etkinliğiniz aktif edildi ve misafir fotoğraf yüklemeleri için hazır hale getirildi.
            </p>

            {/* Details Box */}
            <div 
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-color)',
                textAlign: 'left',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {createdEvent.title}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <div>👰 Gelin: <strong style={{ color: '#fff' }}>{createdEvent.brideName}</strong></div>
                <div>🤵 Damat: <strong style={{ color: '#fff' }}>{createdEvent.groomName}</strong></div>
                <div>📅 Tarih: <strong style={{ color: '#fff' }}>{new Date(createdEvent.eventDate).toLocaleDateString('tr-TR')}</strong></div>
                <div>📍 Mekân: <strong style={{ color: '#fff' }}>{createdEvent.venueName}</strong></div>
              </div>

              {/* Short code & copy link row */}
              <div 
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>
                    Misafir QR Kodu ve Kısa Kod: <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#fff' }}>{createdEvent.shortCode}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px', marginTop: '2px' }}>
                    {typeof window !== 'undefined' ? window.location.origin : ''}/event/{createdEvent.shortCode}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyGuestLink(createdEvent.shortCode)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    backgroundColor: copied ? '#10b981' : '#6366f1',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Bağlantıyı Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Action Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginBottom: '24px' }}>
              <Link 
                href={`/admin/qr?eventId=${createdEvent.id}`}
                className="btn btn-primary"
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <QrCode size={18} />
                <span>QR Kod Üret & İndir</span>
              </Link>

              <Link 
                href={`/admin/photos?eventId=${createdEvent.id}`}
                className="btn btn-secondary"
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <ImageIcon size={18} />
                <span>Fotoğraf Galerisine Git</span>
              </Link>

              <Link 
                href={`/admin/events/${createdEvent.id}`}
                className="btn btn-secondary"
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Edit3 size={18} />
                <span>Etkinliği Düzenle</span>
              </Link>

              <a 
                href={`/event/${createdEvent.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={18} />
                <span>Misafir Ekranını Aç</span>
              </a>
            </div>

            {/* Bottom Modal Nav Buttons */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>Yeni Bir Etkinlik Daha Ekle</span>
              </button>

              <Link 
                href="/admin/events"
                className="btn btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <List size={16} />
                <span>Etkinlik Listesine Dön</span>
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
