'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Image as ImageIcon, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { getDefaultSubjectType } from '@/lib/eventUtils';
import { getEventLandingUrl, getEventUploadUrl } from '@/lib/urlUtils';
import { EventType, SubjectType } from '@prisma/client';
import DeleteEventModal from '../DeleteEventModal';
import CleanStorageModal from '../../storage/CleanStorageModal';

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'WEDDING', label: 'Düğün' },
  { value: 'ENGAGEMENT', label: 'Nişan' },
  { value: 'HENNA', label: 'Kına Gecesi' },
  { value: 'BIRTHDAY', label: 'Doğum Günü' },
  { value: 'GRADUATION', label: 'Mezuniyet' },
  { value: 'BABY_SHOWER', label: 'Baby Shower' },
  { value: 'PROMISE', label: 'Söz' },
  { value: 'CORPORATE', label: 'Kurumsal Organizasyon' },
  { value: 'PARTY', label: 'Parti' },
  { value: 'OTHER', label: 'Diğer' },
];

const SUBJECT_TYPE_OPTIONS: { value: SubjectType; label: string }[] = [
  { value: 'COUPLE', label: 'Çift (Gelin & Damat)' },
  { value: 'PERSON', label: 'Kişi / Etkinlik Sahibi' },
  { value: 'ORGANIZATION', label: 'Kurum / Organizasyon' },
];

interface EditEventFormProps {
  event: {
    id: string;
    title: string;
    slug: string;
    shortCode: string;
    eventType: EventType | string;
    subjectType: SubjectType | string;
    brideName: string;
    groomName: string;
    hostName: string;
    instagramUsername: string;
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
    currentPhotoCount: number;
    currentStorageBytes: number;
    latitude?: number | null;
    longitude?: number | null;
    geofenceRadiusMeters?: number | null;
    locationVerificationEnabled?: boolean;
  };
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCleanModalOpen, setIsCleanModalOpen] = useState(false);

  // Form State initialized with existing event data
  const [title, setTitle] = useState(event.title);
  const [eventType, setEventType] = useState<EventType>((event.eventType as EventType) || 'WEDDING');
  const [subjectType, setSubjectType] = useState<SubjectType>((event.subjectType as SubjectType) || 'COUPLE');
  
  const [brideName, setBrideName] = useState(event.brideName || '');
  const [groomName, setGroomName] = useState(event.groomName || '');
  const [hostName, setHostName] = useState(event.hostName || '');
  const [instagramUsername, setInstagramUsername] = useState(event.instagramUsername || '');

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

  // Geofencing
  const [locationVerificationEnabled, setLocationVerificationEnabled] = useState(event.locationVerificationEnabled || false);
  const [latitude, setLatitude] = useState<string>(event.latitude !== null && event.latitude !== undefined ? event.latitude.toString() : '');
  const [longitude, setLongitude] = useState<string>(event.longitude !== null && event.longitude !== undefined ? event.longitude.toString() : '');
  const [geofenceRadiusMeters, setGeofenceRadiusMeters] = useState<number>(event.geofenceRadiusMeters || 2500);

  // Limits
  const [uploadStartsAt, setUploadStartsAt] = useState(event.uploadStartsAt);
  const [uploadEndsAt, setUploadEndsAt] = useState(event.uploadEndsAt);
  const [maxPhotosPerGuest, setMaxPhotosPerGuest] = useState(event.maxPhotosPerGuest);
  const [maxPhotoSizeMB, setMaxPhotoSizeMB] = useState(event.maxPhotoSizeBytes / 1024 / 1024);
  const [maxTotalPhotos, setMaxTotalPhotos] = useState(event.maxTotalPhotos);
  const [maxStorageGB, setMaxStorageGB] = useState(event.maxStorageBytes / 1024 / 1024 / 1024);

  const handleEventTypeChange = (newType: EventType) => {
    setEventType(newType);
    setSubjectType(getDefaultSubjectType(newType));
  };

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
      formData.append('eventType', eventType);
      formData.append('subjectType', subjectType);
      formData.append('brideName', brideName);
      formData.append('groomName', groomName);
      formData.append('hostName', hostName);
      formData.append('instagramUsername', instagramUsername);
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
      
      formData.append('moderationEnabled', moderationEnabled.toString());
      formData.append('guestNameRequired', guestNameRequired.toString());
      formData.append('guestMessageEnabled', guestMessageEnabled.toString());

      formData.append('locationVerificationEnabled', locationVerificationEnabled.toString());
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('geofenceRadiusMeters', geofenceRadiusMeters.toString());
      
      formData.append('uploadStartsAt', uploadStartsAt);
      formData.append('uploadEndsAt', uploadEndsAt);
      
      formData.append('maxPhotosPerGuest', maxPhotosPerGuest.toString());
      formData.append('maxPhotoSizeBytes', (maxPhotoSizeMB * 1024 * 1024).toString());
      formData.append('maxTotalPhotos', maxTotalPhotos.toString());
      formData.append('maxStorageBytes', (maxStorageGB * 1024 * 1024 * 1024).toString());

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const res = await fetch('/api/admin/events/update', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Etkinlik güncellenemedi.');
      } else {
        setSuccess('Etkinlik başarıyla güncellendi.');
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setError('Ağ hatası veya sunucuya erişilemiyor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-20" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Etkinlik Düzenle: {event.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Kısa Kod: <strong>{event.shortCode}</strong> | Slug: <code>{event.slug}</code>
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href={getEventLandingUrl(event.shortCode)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--palm-dark-green, #183D35)', color: '#F8F6F1' }}
          >
            <span>Karşılama Sayfasını Ön İzle</span>
          </a>
          <Link href="/admin/events" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Etkinlik Listesine Dön</span>
          </Link>
        </div>
      </div>

      {/* Palm Stüdyo Links Box */}
      <div style={{ padding: '16px 20px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.88rem' }}>
        <div>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>MİSAFİR KARŞILAMA LİNKİ (VARSAYILAN / QR)</span>
          <a href={getEventLandingUrl(event.shortCode)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color, #6366f1)', fontWeight: 600 }}>
            {getEventLandingUrl(event.shortCode)}
          </a>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>DOĞRUDAN FOTOĞRAF YÜKLEME LİNKİ</span>
          <a href={getEventUploadUrl(event.shortCode)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color, #6366f1)', fontWeight: 600 }}>
            {getEventUploadUrl(event.shortCode)}
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.9rem' }}>
            {success}
          </div>
        )}

        {/* Section 1: Temel Bilgiler */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Etkinlik Temel Bilgileri
          </h3>

          <div className="form-row" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label htmlFor="eventType">Etkinlik Türü</label>
              <select
                id="eventType"
                className="form-control"
                value={eventType}
                onChange={(e) => handleEventTypeChange(e.target.value as EventType)}
              >
                {EVENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subjectType">Özne Yapısı</label>
              <select
                id="subjectType"
                className="form-control"
                value={subjectType}
                onChange={(e) => setSubjectType(e.target.value as SubjectType)}
              >
                {SUBJECT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

          {/* Dynamic Inputs based on subjectType */}
          {subjectType === 'COUPLE' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brideName">Gelin Adı</label>
                <input
                  id="brideName"
                  type="text"
                  className="form-control"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  required={subjectType === 'COUPLE'}
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
                  required={subjectType === 'COUPLE'}
                />
              </div>
            </div>
          )}

          {subjectType === 'PERSON' && (
            <div className="form-group">
              <label htmlFor="hostName">Etkinlik Sahibi (Kişi Adı)</label>
              <input
                id="hostName"
                type="text"
                className="form-control"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                required={subjectType === 'PERSON'}
              />
            </div>
          )}

          {subjectType === 'ORGANIZATION' && (
            <div className="form-group">
              <label htmlFor="hostName">Kurum / Organizasyon Adı</label>
              <input
                id="hostName"
                type="text"
                className="form-control"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                required={subjectType === 'ORGANIZATION'}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="instagramUsername">Instagram Kullanıcı Adı (İsteğe Bağlı)</label>
            <input
              id="instagramUsername"
              type="text"
              className="form-control"
              placeholder="@firmaadi"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
            />
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

          <div className="form-group">
            <label htmlFor="venueName">Mekân Adı / Salon</label>
            <input
              id="venueName"
              type="text"
              className="form-control"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">İl</label>
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

        {/* Section 2: Görsel & Karşılama Ayarları */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Karşılama Sayfası ve Görsel Tasarımı
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
              rows={3}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="theme">Renk Teması</label>
              <select
                id="theme"
                className="form-control"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="default">Varsayılan (Altın & Koyu Mor)</option>
                <option value="romantic">Romantik (Gül & Pudra Pembe)</option>
                <option value="elegant">Zarif (Zümrüt Yeşili & Bronz)</option>
                <option value="modern">Modern (Gece Mavisi & Gümüş)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Kapak Görselini Değiştir</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
            </div>
          </div>

          {coverImagePreview && (
            <div style={{ marginTop: '12px', width: '100%', maxHeight: '180px', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
              <img src={coverImagePreview} alt="cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        {/* Section 3: Kurallar ve İzinler */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Kurallar ve İzinler
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Etkinlik Durumu</label>
              <select
                id="status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="DRAFT">Taslak</option>
                <option value="PLANNED">Planlandı</option>
                <option value="ACTIVE">Aktif (Fotoğraf Yüklemeye Açık)</option>
                <option value="CLOSED_FOR_UPLOAD">Yüklemeye Kapalı</option>
                <option value="ALBUM_PREPARATION">Albüm Hazırlanıyor</option>
                <option value="READY_FOR_DOWNLOAD">İndirmeye Hazır</option>
                <option value="ARCHIVED">Arşivlendi</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '12px' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={moderationEnabled}
                onChange={(e) => setModerationEnabled(e.target.checked)}
              />
              <span>Fotoğraflar Onay Kuyruğuna Düşsün (Moderasyon)</span>
            </label>

            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={guestNameRequired}
                onChange={(e) => setGuestNameRequired(e.target.checked)}
              />
              <span>Misafir İsmi Zorunlu Olsun</span>
            </label>

            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={guestMessageEnabled}
                onChange={(e) => setGuestMessageEnabled(e.target.checked)}
              />
              <span>Misafir Tebrik Mesajı Yazabilsin</span>
            </label>
          </div>
        </div>

        {/* Section 4: Konum Doğrulaması & Erişim Kontrolü (Geofencing) */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Konum Doğrulaması & Erişim Kontrolü (Geofencing)
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={locationVerificationEnabled}
                onChange={(e) => setLocationVerificationEnabled(e.target.checked)}
              />
              <span>Etkinlik Alanı Konum Doğrulamasını Etkinleştir (Geofencing)</span>
            </label>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', marginLeft: '24px' }}>
              Etkinleştirildiğinde misafirler yalnızca belirlediğiniz konum etrafındaki izin verilen yarıçap içindeyken fotoğraf yükleyebilir.
            </p>
          </div>

          {locationVerificationEnabled && (
            <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="latitude">Enlem (Latitude)</label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="Örn: 37.065833"
                    className="form-control"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitude">Boylam (Longitude)</label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="Örn: 27.258333"
                    className="form-control"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
                  İzin Verilen Yarıçap (Mesafe)
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {[
                    { label: '500 m', value: 500 },
                    { label: '1 km', value: 1000 },
                    { label: '2 km', value: 2000 },
                    { label: '2.5 km', value: 2500 },
                    { label: '3 km', value: 3000 },
                    { label: '5 km', value: 5000 },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      className={`btn ${geofenceRadiusMeters === preset.value ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      onClick={() => setGeofenceRadiusMeters(preset.value)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="form-group" style={{ maxWidth: '240px' }}>
                  <label htmlFor="geofenceRadiusMeters" style={{ fontSize: '0.8rem' }}>Özel Yarıçap (Metre)</label>
                  <input
                    id="geofenceRadiusMeters"
                    type="number"
                    className="form-control"
                    value={geofenceRadiusMeters}
                    onChange={(e) => setGeofenceRadiusMeters(parseInt(e.target.value, 10) || 500)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Limitler */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Limit ve Kotalar
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxPhotosPerGuest">Misafir Başına Maks Fotoğraf</label>
              <input
                id="maxPhotosPerGuest"
                type="number"
                className="form-control"
                value={maxPhotosPerGuest}
                onChange={(e) => setMaxPhotosPerGuest(parseInt(e.target.value, 10) || 1)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxPhotoSizeMB">Tek Fotoğraf Maks Boyut (MB)</label>
              <input
                id="maxPhotoSizeMB"
                type="number"
                className="form-control"
                value={maxPhotoSizeMB}
                onChange={(e) => setMaxPhotoSizeMB(parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxTotalPhotos">Toplam Etkinlik Fotoğraf Limiti</label>
              <input
                id="maxTotalPhotos"
                type="number"
                className="form-control"
                value={maxTotalPhotos}
                onChange={(e) => setMaxTotalPhotos(parseInt(e.target.value, 10) || 100)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxStorageGB">Toplam Depolama Kotası (GB)</label>
              <input
                id="maxStorageGB"
                type="number"
                className="form-control"
                value={maxStorageGB}
                onChange={(e) => setMaxStorageGB(parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Tehlikeli Bölge */}
        <div className="section-card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--danger, #ef4444)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '8px' }}>
            <AlertTriangle size={18} />
            <span>Tehlikeli Bölge (Depolama & Silme)</span>
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Etkinlik Fotoğraflarını & Depolamasını Temizle</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Etkinliği silmeden sadece bu etkinliğe yüklenmiş fotoğrafları ve ZIP paketlerini diskten siler.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCleanModalOpen(true)}
              className="btn btn-secondary"
              style={{ color: 'var(--warning, #f59e0b)', borderColor: 'var(--warning, #f59e0b)' }}
            >
              <RefreshCw size={16} />
              <span>Depolamayı Temizle</span>
            </button>
          </div>

          <hr style={{ margin: '16px 0', borderColor: 'rgba(239, 68, 68, 0.15)' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--danger, #ef4444)' }}>Etkinliği Kalıcı Olarak Sil</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Etkinliği, tüm fotoğraflarını, QR verilerini, oturumlarını ve ilgili tüm kayıtları kalıcı olarak kaldırır.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn btn-danger"
              style={{ backgroundColor: 'var(--danger, #ef4444)', color: '#fff' }}
            >
              <Trash2 size={16} />
              <span>Etkinliği Sil</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Link href="/admin/events" className="btn btn-secondary">
            İptal
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} />
            <span>{loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}</span>
          </button>
        </div>

      </form>

      {/* Modals */}
      <CleanStorageModal
        isOpen={isCleanModalOpen}
        onClose={() => setIsCleanModalOpen(false)}
        event={{
          id: event.id,
          title: event.title,
          shortCode: event.shortCode,
          currentPhotoCount: event.currentPhotoCount,
        }}
      />

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        event={{
          id: event.id,
          title: event.title,
          shortCode: event.shortCode,
        }}
        onSuccess={() => router.push('/admin/events')}
      />
    </div>
  );
}
