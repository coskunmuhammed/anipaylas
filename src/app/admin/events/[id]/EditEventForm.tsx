'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface EditEventFormProps {
  event: {
    id: string;
    title: string;
    slug: string;
    shortCode: string;
    brideName: string;
    groomName: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    venueName: string;
    city: string;
    district: string;
    welcomeTitle: string;
    welcomeMessage: string;
    coverImageUrl: string | null;
    theme: string;
    status: string;
    uploadStartsAt: string;
    uploadEndsAt: string;
    moderationEnabled: boolean;
    guestNameRequired: boolean;
    guestMessageEnabled: boolean;
    maxPhotosPerGuest: number;
    maxPhotoSizeBytes: number;
    maxTotalPhotos: number;
    maxStorageBytes: number;
  };
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State initialized with existing event data
  const [title, setTitle] = useState(event.title);
  const [brideName, setBrideName] = useState(event.brideName);
  const [groomName, setGroomName] = useState(event.groomName);
  const [eventDate, setEventDate] = useState(event.eventDate);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [venueName, setVenueName] = useState(event.venueName);
  const [city, setCity] = useState(event.city);
  const [district, setDistrict] = useState(event.district);
  
  // Customization
  const [welcomeTitle, setWelcomeTitle] = useState(event.welcomeTitle);
  const [welcomeMessage, setWelcomeMessage] = useState(event.welcomeMessage);
  const [theme, setTheme] = useState(event.theme);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(event.coverImageUrl);
  
  // Settings & Rules
  const [status, setStatus] = useState(event.status);
  const [moderationEnabled, setModerationEnabled] = useState(event.moderationEnabled);
  const [guestNameRequired, setGuestNameRequired] = useState(event.guestNameRequired);
  const [guestMessageEnabled, setGuestMessageEnabled] = useState(event.guestMessageEnabled);

  // Limits
  const [uploadStartsAt, setUploadStartsAt] = useState(event.uploadStartsAt);
  const [uploadEndsAt, setUploadEndsAt] = useState(event.uploadEndsAt);
  const [maxPhotosPerGuest, setMaxPhotosPerGuest] = useState(event.maxPhotosPerGuest);
  const [maxPhotoSizeMB, setMaxPhotoSizeMB] = useState(event.maxPhotoSizeBytes / 1024 / 1024);
  const [maxTotalPhotos, setMaxTotalPhotos] = useState(event.maxTotalPhotos);
  const [maxStorageGB, setMaxStorageGB] = useState(event.maxStorageBytes / 1024 / 1024 / 1024);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('id', event.id);
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
      
      const startDateTime = uploadStartsAt ? new Date(uploadStartsAt).toISOString() : new Date(eventDate + 'T' + startTime).toISOString();
      const endDateTime = uploadEndsAt ? new Date(uploadEndsAt).toISOString() : new Date(new Date(eventDate + 'T' + endTime).getTime() + 24 * 60 * 60 * 1000).toISOString();
      
      formData.append('uploadStartsAt', startDateTime);
      formData.append('uploadEndsAt', endDateTime);
      
      formData.append('maxPhotosPerGuest', String(maxPhotosPerGuest));
      formData.append('maxPhotoSizeBytes', String(maxPhotoSizeMB * 1024 * 1024));
      formData.append('maxTotalPhotos', String(maxTotalPhotos));
      formData.append('maxStorageBytes', String(maxStorageGB * 1024 * 1024 * 1024));
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const res = await fetch('/api/admin/events/update', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Etkinlik güncellenirken bir hata oluştu.');
      } else {
        setSuccess('Etkinlik başarıyla güncellendi.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        router.refresh();
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Etkinliği Düzenle</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Düzenlediğiniz etkinlik: <strong style={{ color: '#fff' }}>{event.title}</strong> (Kısa Kod: {event.shortCode})
            </p>
          </div>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}
      {success && (
        <div 
          className="login-error" 
          style={{ 
            backgroundColor: 'var(--success-light)', 
            borderColor: 'rgba(16, 185, 129, 0.2)', 
            color: 'var(--success)' 
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1: Temel Bilgiler */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Düğün Temel Bilgileri
          </h3>
          
          <div className="form-group">
            <label htmlFor="title">Etkinlik Adı</label>
            <input
              id="title"
              type="text"
              className="form-control"
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
                    <img 
                      src={coverImagePreview}
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
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
              <label htmlFor="uploadStartsAt">Yükleme Başlangıç Tarih & Saati</label>
              <input
                id="uploadStartsAt"
                type="datetime-local"
                className="form-control"
                value={uploadStartsAt}
                onChange={(e) => setUploadStartsAt(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="uploadEndsAt">Yükleme Bitiş Tarih & Saati</label>
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
            Geri Dön
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} />
            <span>{loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
