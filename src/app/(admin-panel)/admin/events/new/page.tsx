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
import { getDefaultSubjectType, getDefaultWelcomeText, normalizeInstagramUsername } from '@/lib/eventUtils';
import { EventType, SubjectType } from '@prisma/client';

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

interface CreatedEventData {
  id: string;
  title: string;
  shortCode: string;
  eventType: string;
  subjectType: string;
  brideName?: string | null;
  groomName?: string | null;
  hostName?: string | null;
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
  const [eventType, setEventType] = useState<EventType>('WEDDING');
  const [subjectType, setSubjectType] = useState<SubjectType>('COUPLE');
  
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [hostName, setHostName] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');

  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('23:00');
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  
  // Customization state with touch flags
  const [welcomeTitle, setWelcomeTitle] = useState('Düğün Albümümüze Hoş Geldiniz');
  const [welcomeMessage, setWelcomeMessage] = useState('Bu özel günümüzde çektiğiniz güzel anıları bizimle paylaşın.');
  const [welcomeTitleTouched, setWelcomeTitleTouched] = useState(false);
  const [welcomeMessageTouched, setWelcomeMessageTouched] = useState(false);

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

  const handleEventTypeChange = (newType: EventType) => {
    setEventType(newType);
    const newSubject = getDefaultSubjectType(newType);
    setSubjectType(newSubject);

    const defaultTexts = getDefaultWelcomeText(newType);
    if (!welcomeTitleTouched) {
      setWelcomeTitle(defaultTexts.title);
    }
    if (!welcomeMessageTouched) {
      setWelcomeMessage(defaultTexts.message);
    }
  };

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
    setEventType('WEDDING');
    setSubjectType('COUPLE');
    setBrideName('');
    setGroomName('');
    setHostName('');
    setInstagramUsername('');
    setEventDate('');
    setVenueName('');
    setCity('');
    setDistrict('');
    setCoverImage(null);
    setCoverImagePreview(null);
    setCreatedEvent(null);
    setError(null);
    setWelcomeTitleTouched(false);
    setWelcomeMessageTouched(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
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
      
      formData.append('uploadStartsAt', uploadStartsAt);
      formData.append('uploadEndsAt', uploadEndsAt);
      
      formData.append('maxPhotosPerGuest', maxPhotosPerGuest.toString());
      formData.append('maxPhotoSizeBytes', (maxPhotoSizeMB * 1024 * 1024).toString());
      formData.append('maxTotalPhotos', maxTotalPhotos.toString());
      formData.append('maxStorageBytes', (maxStorageGB * 1024 * 1024 * 1024).toString());

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const res = await fetch('/api/admin/events/create', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Etkinlik oluşturulamadı.');
      } else {
        setCreatedEvent(data.event);
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
      <div className="flex-between mb-20">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Yeni Etkinlik Oluştur</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Etkinlik detaylarını, kurallarını ve tema tercihlerini belirleyin.
          </p>
        </div>
        <Link href="/admin/events" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Etkinlik Listesine Dön</span>
        </Link>
      </div>

      {/* Success Modal / State */}
      {createdEvent ? (
        <div className="section-card" style={{ border: '1px solid var(--success-light)', background: 'rgba(16, 185, 129, 0.03)' }}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', marginBottom: '16px' }}>
              <CheckCircle2 size={48} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
              Etkinlik Başarıyla Oluşturuldu!
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Misafirlerinizin fotoğraf yükleyebileceği bağlantı ve QR kod hazır.
            </p>

            {/* Quick Details */}
            <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', maxWidth: '500px', margin: '0 auto 24px', textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>{createdEvent.title}</div>
              {createdEvent.subjectType === 'COUPLE' ? (
                <div style={{ fontSize: '0.9rem' }}>🤵 Çift: <strong>{createdEvent.brideName} & {createdEvent.groomName}</strong></div>
              ) : (
                <div style={{ fontSize: '0.9rem' }}>👤 Sahibi: <strong>{createdEvent.hostName}</strong></div>
              )}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {new Date(createdEvent.eventDate).toLocaleDateString('tr-TR')} - {createdEvent.venueName} ({createdEvent.city})
              </div>
              <div style={{ display: 'inline-block', marginTop: '10px', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem' }}>
                Kısa Kod: {createdEvent.shortCode}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleCopyGuestLink(createdEvent.shortCode)} 
                className="btn btn-primary"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Kopyalandı!' : 'Misafir Yükleme Linkini Kopyala'}</span>
              </button>
              
              <Link href={`/admin/qr`} className="btn btn-secondary">
                <QrCode size={16} />
                <span>QR Kod Üret</span>
              </Link>
              
              <Link href={`/admin/events/${createdEvent.id}`} className="btn btn-secondary">
                <Edit3 size={16} />
                <span>Düzenle</span>
              </Link>

              <button onClick={resetForm} className="btn btn-secondary">
                <Plus size={16} />
                <span>Yeni Etkinlik Ekle</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Section 1: Temel Bilgiler */}
          <div className="section-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Etkinlik Temel Bilgileri
            </h3>

            {/* Event Type & Subject Type Selection */}
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
              <label htmlFor="title">Etkinlik Adı (Başlık)</label>
              <input
                id="title"
                type="text"
                className="form-control"
                placeholder="örn: Ayşe & Mustafa Düğün Hatırası veya Mehmet'in 30. Yaş Günü"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Dynamic Name Inputs based on subjectType */}
            {subjectType === 'COUPLE' && (
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
                    required={subjectType === 'COUPLE'}
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
                  placeholder="örn: Mehmet Yılmaz"
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
                  placeholder="örn: ABC Teknoloji Lansmanı"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  required={subjectType === 'ORGANIZATION'}
                />
              </div>
            )}

            {/* Instagram Username Field */}
            <div className="form-group">
              <label htmlFor="instagramUsername">Instagram Kullanıcı Adı (İsteğe Bağlı)</label>
              <input
                id="instagramUsername"
                type="text"
                className="form-control"
                placeholder="örn: @firmaadi veya dugunhikayem"
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value)}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Doldurulursa fotoğraf yükleme başarı ekranında Instagram takip kartı gösterilecektir.
              </p>
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
                placeholder="örn: Glamour Balo Salonu"
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
                onChange={(e) => {
                  setWelcomeTitle(e.target.value);
                  setWelcomeTitleTouched(true);
                }}
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
                onChange={(e) => {
                  setWelcomeMessage(e.target.value);
                  setWelcomeMessageTouched(true);
                }}
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
                <label>Kapak Görseli (Afiş / Banner)</label>
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

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link href="/admin/events" className="btn btn-secondary">
              İptal
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Kaydediliyor...' : 'Etkinliği Kaydet ve Başlat'}</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
