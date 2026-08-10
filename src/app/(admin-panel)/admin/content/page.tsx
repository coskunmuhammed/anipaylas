'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  MapPin, 
  Star, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Film,
  Upload,
  Plus,
  Trash2,
  Camera
} from 'lucide-react';
import { HomepageContent, DEFAULT_HOMEPAGE_CONTENT } from '@/types/siteContent';
import { ServiceItem, servicesData } from '@/data/services';
import { getMediaUrl } from '@/lib/mediaUrl';

export default function AdminContentManagementPage() {
  const [content, setContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(servicesData);
  const [selectedServiceIdx, setSelectedServiceIdx] = useState<number>(0);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'serviceArea' | 'concepts' | 'stories' | 'testimonials' | 'contact' | 'serviceDetails'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch content and service details on load
  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/content');
        const json = await res.json();
        if (json.success && json.data) {
          setContent(json.data);
        }

        const sRes = await fetch('/api/admin/services');
        const sJson = await sRes.json();
        if (sJson.success && Array.isArray(sJson.data) && sJson.data.length > 0) {
          setServicesList(sJson.data);
        }
      } catch (err) {
        console.error('Error fetching admin content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleChange = (section: keyof HomepageContent, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayItemChange = (section: 'services' | 'concepts' | 'stories' | 'testimonials', index: number, field: string, value: any) => {
    setContent((prev) => {
      const currentItems = [...((prev[section] as any).items || [])];
      if (currentItems[index]) {
        currentItems[index] = { ...currentItems[index], [field]: value };
      }
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          items: currentItems,
        },
      };
    });
  };

  const handleHeroBgPhotoChange = (index: number, value: string) => {
    setContent((prev) => {
      const current = [...(prev.hero.backgroundPhotos || DEFAULT_HOMEPAGE_CONTENT.hero.backgroundPhotos)];
      current[index] = value;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          backgroundPhotos: current,
        },
      };
    });
  };

  const handleHeroBgFileUpload = async (index: number, file: File) => {
    const key = `heroBg-${index}`;
    try {
      setUploadingKey(key);
      setStatusMessage(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'hero');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (res.ok && json.success && json.url) {
        handleHeroBgPhotoChange(index, json.url);
        setStatusMessage({ type: 'success', text: `Hero arka plan görseli #${index + 1} yüklendi!` });
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Görsel yüklenemedi.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Yükleme hatası.' });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleMemoryPhotoChange = (key: 'photo1' | 'photo2' | 'photo3', value: string) => {
    setContent((prev) => ({
      ...prev,
      memoryStatement: {
        ...(prev.memoryStatement || DEFAULT_HOMEPAGE_CONTENT.memoryStatement),
        [key]: value,
      },
    }));
  };

  const handleMemoryFileUpload = async (key: 'photo1' | 'photo2' | 'photo3', file: File) => {
    const uploadKey = `memory-${key}`;
    try {
      setUploadingKey(uploadKey);
      setStatusMessage(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'hero');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (res.ok && json.success && json.url) {
        handleMemoryPhotoChange(key, json.url);
        setStatusMessage({ type: 'success', text: `Açılan polaroid görseli yüklendi!` });
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Görsel yüklenemedi.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Yükleme hatası.' });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleAddTestimonial = () => {
    setContent((prev) => {
      const currentItems = [...(prev.testimonials.items || [])];
      currentItems.push({
        id: Date.now().toString(),
        name: 'Yeni Çift İsmi',
        location: 'İzmir → Didim',
        rating: 5,
        text: 'Didim çekim deneyimimiz harikaydı, Palm Stüdyo ekibine teşekkür ederiz!',
        date: 'Ağustos 2026',
      });
      return {
        ...prev,
        testimonials: {
          ...prev.testimonials,
          items: currentItems,
        },
      };
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    if (confirm('Bu müşteri yorumunu silmek istediğinize emin misiniz?')) {
      setContent((prev) => {
        const currentItems = [...(prev.testimonials.items || [])];
        currentItems.splice(index, 1);
        return {
          ...prev,
          testimonials: {
            ...prev.testimonials,
            items: currentItems,
          },
        };
      });
    }
  };

  const handleFileUpload = async (section: 'services' | 'concepts' | 'stories', index: number, file: File) => {
    const key = `${section}-${index}`;
    try {
      setUploadingKey(key);
      setStatusMessage(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', section);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.url) {
        handleArrayItemChange(section, index, 'image', json.url);
        setStatusMessage({ type: 'success', text: `Görsel başarıyla yüklendi! VPS ve sunucuda yayında: ${json.fileName}` });
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Fotoğraf yüklenirken bir hata oluştu.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Fotoğraf yükleme bağlantı hatası.' });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);

      // Save Homepage Content
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const json = await res.json();

      // Save Service Details Content
      const sRes = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicesList),
      });
      const sJson = await sRes.json();

      if (res.ok && json.success && sRes.ok && sJson.success) {
        setStatusMessage({ type: 'success', text: 'Tüm anasayfa içerikleri ve hizmet detay fotoğrafları başarıyla kaydedildi!' });
        if (json.data) setContent(json.data);
        if (sJson.data) setServicesList(sJson.data);
      } else {
        setStatusMessage({ type: 'error', text: json.error || sJson.error || 'Kaydederken bir hata oluştu.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Bağlantı hatası oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddServiceGalleryPhoto = (serviceIdx: number, photoUrl: string) => {
    if (!photoUrl.trim()) return;
    setServicesList((prev) => {
      const updated = [...prev];
      const target = { ...updated[serviceIdx] };
      const currentGallery = [...(target.galleryPhotos || [])];
      currentGallery.push(photoUrl.trim());
      target.galleryPhotos = currentGallery;
      updated[serviceIdx] = target;
      return updated;
    });
    setNewPhotoUrl('');
  };

  const handleDeleteServiceGalleryPhoto = (serviceIdx: number, photoIdx: number) => {
    setServicesList((prev) => {
      const updated = [...prev];
      const target = { ...updated[serviceIdx] };
      const currentGallery = [...(target.galleryPhotos || [])];
      currentGallery.splice(photoIdx, 1);
      target.galleryPhotos = currentGallery;
      updated[serviceIdx] = target;
      return updated;
    });
  };

  const handleServiceGalleryFileUpload = async (serviceIdx: number, file: File) => {
    const key = `serviceGallery-${serviceIdx}`;
    try {
      setUploadingKey(key);
      setStatusMessage(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'services');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (res.ok && json.success && json.url) {
        handleAddServiceGalleryPhoto(serviceIdx, json.url);
        setStatusMessage({ type: 'success', text: 'Hizmet fotoğrafı yüklendi ve galeriye eklendi!' });
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Görsel yüklenemedi.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Yükleme hatası.' });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleResetSection = (section: keyof HomepageContent) => {
    if (confirm('Bu bölümü varsayılan değerlere sıfırlamak istediğinize emin misiniz?')) {
      setContent((prev) => ({
        ...prev,
        [section]: JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONTENT[section])),
      }));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--text-secondary)' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary)', marginRight: '12px' }} />
        <span>İçerikler yükleniyor...</span>
      </div>
    );
  }

  const tabs = [
    { key: 'hero', label: '1. Hero & Çapraz Fotoğraf Izgarası', icon: Sparkles },
    { key: 'services', label: '2. Hizmet Kartları & Görseller', icon: Layers },
    { key: 'serviceArea', label: '3. Nereden Geliyorlar (Harita)', icon: MapPin },
    { key: 'concepts', label: '4. İmza Konsept Görselleri', icon: Star },
    { key: 'stories', label: '5. Gerçek Hikâyeler', icon: Film },
    { key: 'testimonials', label: '6. Müşteri Yorumları', icon: MessageSquare },
    { key: 'contact', label: '7. İletişim & CTA', icon: PhoneCall },
    { key: 'serviceDetails', label: '8. Hizmet Detay & Galeri Yönetimi', icon: Camera },
  ];

  const currentHeroBgPhotos = content.hero.backgroundPhotos && content.hero.backgroundPhotos.length > 0 
    ? content.hero.backgroundPhotos 
    : DEFAULT_HOMEPAGE_CONTENT.hero.backgroundPhotos;

  const currentMemory = content.memoryStatement || DEFAULT_HOMEPAGE_CONTENT.memoryStatement;

  return (
    <div style={{ padding: '24px 16px 60px 16px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Anasayfa İçerik & Görsel Yönetimi (CMS)
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Çapraz arka plan görsellerini, aşağı kaydırınca açılan polaroid kartlarını ve tüm metinleri bilgisayarınızdan yükleyin.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="palm-btn-gold"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: 'var(--primary)',
            color: '#0d0b09',
            borderRadius: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(201, 170, 103, 0.3)',
          }}
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
        </button>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.95rem',
            fontWeight: 600,
            backgroundColor: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: statusMessage.type === 'success' ? '#34d399' : '#f87171',
            border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tab Controls Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '28px',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        {/* TAB 1: HERO & BACKGROUND GRID */}
        {activeTab === 'hero' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>1. Hero Metinleri & Çapraz Dönen Arka Plan Fotoğrafları</h2>
              <button onClick={() => handleResetSection('hero')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Varsayılana Sıfırla
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '36px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Üst Kategori Rozeti (Eyebrow)</label>
                <input
                  type="text"
                  value={content.hero.eyebrow}
                  onChange={(e) => handleChange('hero', 'eyebrow', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Ana Başlık Satır 1</label>
                  <input
                    type="text"
                    value={content.hero.titleLine1}
                    onChange={(e) => handleChange('hero', 'titleLine1', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Ana Başlık Satır 2 (İtalik Altın)</label>
                  <input
                    type="text"
                    value={content.hero.titleLine2}
                    onChange={(e) => handleChange('hero', 'titleLine2', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Açıklama Metni (Paragraph)</label>
                <textarea
                  rows={3}
                  value={content.hero.description}
                  onChange={(e) => handleChange('hero', 'description', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Hero Diagonal Background Photos Editor */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} /> Anasayfa Arkadaki Çapraz Dönen Fotoğraflar (6 Adet)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '40px' }}>
              {currentHeroBgPhotos.slice(0, 6).map((imgUrl, idx) => {
                const uploadKey = `heroBg-${idx}`;
                const isUploading = uploadingKey === uploadKey;
                return (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '70px', height: '90px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                      <img src={getMediaUrl(imgUrl)} alt={`Çapraz Görsel ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>Çapraz Görsel #{idx + 1}</span>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleHeroBgPhotoChange(idx, e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.8rem' }}
                      />
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(201, 170, 103, 0.15)',
                          border: '1px solid rgba(201, 170, 103, 0.4)',
                          color: '#c9aa67',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          width: 'fit-content',
                        }}
                      >
                        {isUploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />}
                        <span>{isUploading ? 'Yükleniyor...' : '📁 Görsel Yükle'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleHeroBgFileUpload(idx, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Memory Statement 3 Fanning Polaroids Editor */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} /> &quot;Düğün Geçer Anılar Kalır&quot; Açılan 3 Polaroid Kartı
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { key: 'photo1', label: '1. Sol Polaroid Kartı' },
                { key: 'photo2', label: '2. Sağ Polaroid Kartı' },
                { key: 'photo3', label: '3. Orta Ön Polaroid Kartı' },
              ].map((item) => {
                const photoKey = item.key as 'photo1' | 'photo2' | 'photo3';
                const imgUrl = currentMemory[photoKey] || DEFAULT_HOMEPAGE_CONTENT.memoryStatement[photoKey];
                const uploadKey = `memory-${photoKey}`;
                const isUploading = uploadingKey === uploadKey;
                return (
                  <div key={item.key} style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '75px', height: '95px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', padding: '4px 4px 16px 4px', border: '1px solid var(--border-color)', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                      <img src={getMediaUrl(imgUrl)} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>{item.label}</span>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleMemoryPhotoChange(photoKey, e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.8rem' }}
                      />
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(201, 170, 103, 0.15)',
                          border: '1px solid rgba(201, 170, 103, 0.4)',
                          color: '#c9aa67',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          width: 'fit-content',
                        }}
                      >
                        {isUploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />}
                        <span>{isUploading ? 'Yükleniyor...' : '📁 Polaroid Yükle'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleMemoryFileUpload(photoKey, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & IMAGES */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>2. Hizmetlerimiz & Kart Görselleri</h2>
              <button onClick={() => handleResetSection('services')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Varsayılana Sıfırla
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Üst Kategori Rozeti (Eyebrow)</label>
                <input
                  type="text"
                  value={content.services.eyebrow}
                  onChange={(e) => handleChange('services', 'eyebrow', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Bölüm Başlığı</label>
                <input
                  type="text"
                  value={content.services.title}
                  onChange={(e) => handleChange('services', 'title', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            {/* Service Cards Edit Grid */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} /> Hizmet Kart Fotoğrafları & Yükleme
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(content.services.items || DEFAULT_HOMEPAGE_CONTENT.services.items).map((item, idx) => {
                const key = `services-${idx}`;
                const isUploading = uploadingKey === key;
                return (
                  <div
                    key={item.id || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      gap: '20px',
                      padding: '20px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      alignItems: 'center',
                    }}
                  >
                    {/* Image Preview Thumbnail */}
                    <div style={{ width: '120px', height: '110px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-color)' }}>
                      <img src={getMediaUrl(item.image)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Fields & Upload Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Hizmet Adı</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleArrayItemChange('services', idx, 'title', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Görsel URL Adresi veya Bilgisayardan Yükle</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={item.image}
                              onChange={(e) => handleArrayItemChange('services', idx, 'image', e.target.value)}
                              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                            />
                            <label
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(201, 170, 103, 0.15)',
                                border: '1px solid rgba(201, 170, 103, 0.4)',
                                color: '#c9aa67',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                              <span>{isUploading ? 'Yükleniyor...' : '📁 Yükle'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload('services', idx, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Kısa Açıklama Metni</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleArrayItemChange('services', idx, 'description', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICE AREA */}
        {activeTab === 'serviceArea' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>3. Nereden Geliyorlar (Harita Bölümü)</h2>
              <button onClick={() => handleResetSection('serviceArea')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Varsayılana Sıfırla
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Üst Kategori Rozeti (Eyebrow)</label>
                <input
                  type="text"
                  value={content.serviceArea.eyebrow}
                  onChange={(e) => handleChange('serviceArea', 'eyebrow', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Ana Başlık</label>
                <input
                  type="text"
                  value={content.serviceArea.title}
                  onChange={(e) => handleChange('serviceArea', 'title', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Açıklama Metni</label>
                <textarea
                  rows={3}
                  value={content.serviceArea.description}
                  onChange={(e) => handleChange('serviceArea', 'description', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Merkez Stüdyo Garanti Başlığı</label>
                <input
                  type="text"
                  value={content.serviceArea.studioGuaranteeTitle}
                  onChange={(e) => handleChange('serviceArea', 'studioGuaranteeTitle', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Merkez Stüdyo Garanti Metni</label>
                <textarea
                  rows={3}
                  value={content.serviceArea.studioGuaranteeText}
                  onChange={(e) => handleChange('serviceArea', 'studioGuaranteeText', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONCEPTS & IMAGES */}
        {activeTab === 'concepts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>4. İmza Konseptler & Fotoğrafları</h2>
              <button onClick={() => handleResetSection('concepts')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Varsayılana Sıfırla
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Üst Kategori Rozeti (Eyebrow)</label>
                <input
                  type="text"
                  value={content.concepts.eyebrow}
                  onChange={(e) => handleChange('concepts', 'eyebrow', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Bölüm Başlığı</label>
                <input
                  type="text"
                  value={content.concepts.title}
                  onChange={(e) => handleChange('concepts', 'title', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            {/* Concept Cards Edit List */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} /> Konsept Fotoğrafları & Yükleme
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(content.concepts.items || DEFAULT_HOMEPAGE_CONTENT.concepts.items).map((item, idx) => {
                const key = `concepts-${idx}`;
                const isUploading = uploadingKey === key;
                return (
                  <div
                    key={item.slug || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      gap: '20px',
                      padding: '20px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      alignItems: 'center',
                    }}
                  >
                    {/* Image Preview Thumbnail */}
                    <div style={{ width: '120px', height: '110px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-color)' }}>
                      <img src={getMediaUrl(item.image)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Konsept Adı</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleArrayItemChange('concepts', idx, 'title', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Etiket / Kategori</label>
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => handleArrayItemChange('concepts', idx, 'category', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Görsel URL Adresi veya Bilgisayardan Yükle</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={item.image}
                              onChange={(e) => handleArrayItemChange('concepts', idx, 'image', e.target.value)}
                              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                            />
                            <label
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(201, 170, 103, 0.15)',
                                border: '1px solid rgba(201, 170, 103, 0.4)',
                                color: '#c9aa67',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                              <span>{isUploading ? 'Yükleniyor...' : '📁 Yükle'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload('concepts', idx, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Açıklama Metni</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleArrayItemChange('concepts', idx, 'description', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: STORIES & IMAGES */}
        {activeTab === 'stories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>5. Gerçek Hikâyeler & Kart Görselleri</h2>
              <button onClick={() => handleResetSection('stories')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Varsayılana Sıfırla
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Üst Kategori Rozeti (Eyebrow)</label>
                <input
                  type="text"
                  value={content.stories.eyebrow}
                  onChange={(e) => handleChange('stories', 'eyebrow', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Bölüm Başlığı</label>
                <input
                  type="text"
                  value={content.stories.title}
                  onChange={(e) => handleChange('stories', 'title', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            {/* Story Cards Edit List */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Film size={18} /> Hikâye Kapak Fotoğrafları & Yükleme
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(content.stories.items || DEFAULT_HOMEPAGE_CONTENT.stories.items).map((item, idx) => {
                const key = `stories-${idx}`;
                const isUploading = uploadingKey === key;
                return (
                  <div
                    key={item.id || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      gap: '20px',
                      padding: '20px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      alignItems: 'center',
                    }}
                  >
                    {/* Image Preview Thumbnail */}
                    <div style={{ width: '120px', height: '110px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-color)' }}>
                      <img src={getMediaUrl(item.image)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Hikâye Başlığı</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleArrayItemChange('stories', idx, 'title', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Alt Başlık / Etiket</label>
                          <input
                            type="text"
                            value={item.subtitle}
                            onChange={(e) => handleArrayItemChange('stories', idx, 'subtitle', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Video URL (YouTube/MP4)</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={item.videoUrl || ''}
                            onChange={(e) => handleArrayItemChange('stories', idx, 'videoUrl', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Kapak Fotoğrafı URL veya Yükle</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={item.image}
                              onChange={(e) => handleArrayItemChange('stories', idx, 'image', e.target.value)}
                              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                            />
                            <label
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(201, 170, 103, 0.15)',
                                border: '1px solid rgba(201, 170, 103, 0.4)',
                                color: '#c9aa67',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                              <span>{isUploading ? 'Yükleniyor...' : '📁 Yükle'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload('stories', idx, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>6. Müşteri Yorumları Bölümü</h2>
              <button onClick={() => handleResetSection('testimonials')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Varsayılana Sıfırla
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Üst Kategori Rozeti (Eyebrow)</label>
                <input
                  type="text"
                  value={content.testimonials.eyebrow}
                  onChange={(e) => handleChange('testimonials', 'eyebrow', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Bölüm Başlığı</label>
                <input
                  type="text"
                  value={content.testimonials.title}
                  onChange={(e) => handleChange('testimonials', 'title', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Açıklama Metni</label>
                <textarea
                  rows={3}
                  value={content.testimonials.description}
                  onChange={(e) => handleChange('testimonials', 'description', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Testimonial Cards Edit Grid */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} /> Çift Yorumları Listesi ({content.testimonials.items?.length || 0} Adet)
              </h3>

              <button
                onClick={handleAddTestimonial}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(201, 170, 103, 0.15)',
                  border: '1px solid rgba(201, 170, 103, 0.4)',
                  color: '#c9aa67',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                <span>Yeni Müşteri Yorumu Ekle</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(content.testimonials.items || DEFAULT_HOMEPAGE_CONTENT.testimonials.items).map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    padding: '20px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Yorum #{idx + 1}
                    </div>
                    <button
                      onClick={() => handleRemoveTestimonial(idx)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} /> Sil
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Çift / Müşteri Adı</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleArrayItemChange('testimonials', idx, 'name', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Geldiği Şehir / Konum</label>
                      <input
                        type="text"
                        value={item.location || ''}
                        onChange={(e) => handleArrayItemChange('testimonials', idx, 'location', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Yıldız Puanı</label>
                      <select
                        value={item.rating || 5}
                        onChange={(e) => handleArrayItemChange('testimonials', idx, 'rating', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 Yıldız)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 Yıldız)</option>
                        <option value={3}>⭐⭐⭐ (3 Yıldız)</option>
                        <option value={2}>⭐⭐ (2 Yıldız)</option>
                        <option value={1}>⭐ (1 Yıldız)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Çekim Tarihi</label>
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => handleArrayItemChange('testimonials', idx, 'date', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Müşteri Yorum Metni</label>
                    <textarea
                      rows={3}
                      value={item.text}
                      onChange={(e) => handleArrayItemChange('testimonials', idx, 'text', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT & CTA */}
        {activeTab === 'contact' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>7. İletişim & Alt CTA Bölümü</h2>
              <button onClick={() => handleResetSection('contact')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Varsayılana Sıfırla
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Üst Kategori Rozeti (Eyebrow)</label>
                <input
                  type="text"
                  value={content.contact.eyebrow}
                  onChange={(e) => handleChange('contact', 'eyebrow', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Bölüm Başlığı</label>
                <input
                  type="text"
                  value={content.contact.title}
                  onChange={(e) => handleChange('contact', 'title', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Açıklama Metni</label>
                <textarea
                  rows={3}
                  value={content.contact.description}
                  onChange={(e) => handleChange('contact', 'description', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>İletişim Telefon Numarası</label>
                <input
                  type="text"
                  value={content.contact.phoneText}
                  onChange={(e) => handleChange('contact', 'phoneText', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SERVICE DETAILS & GALLERY MANAGEMENT */}
        {activeTab === 'serviceDetails' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                8. Hizmet Detay Sayfaları & Fotoğraf Galerisi Yönetimi
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                "İncele" butonuna basınca açılan hizmet detay sayfalarının içeriklerini ve "Hizmet Sürecimiz" altına eklenecek fotoğraf galerisini düzenleyin.
              </p>
            </div>

            {/* Service Selection Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {servicesList.map((svc, sIdx) => {
                const isSelected = selectedServiceIdx === sIdx;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedServiceIdx(sIdx)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 500,
                      backgroundColor: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#0d0b09' : '#ffffff',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {svc.title} {svc.galleryPhotos ? `(${svc.galleryPhotos.length} foto)` : ''}
                  </button>
                );
              })}
            </div>

            {/* Selected Service Editor Card */}
            {servicesList[selectedServiceIdx] && (
              <div style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Düzenlenen Hizmet: {servicesList[selectedServiceIdx].title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Slug: /hizmetler/{servicesList[selectedServiceIdx].slug}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Hizmet Başlığı</label>
                      <input
                        type="text"
                        value={servicesList[selectedServiceIdx].title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setServicesList((prev) => {
                            const updated = [...prev];
                            updated[selectedServiceIdx] = { ...updated[selectedServiceIdx], title: val };
                            return updated;
                          });
                        }}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Kapak Görseli URL</label>
                      <input
                        type="text"
                        value={servicesList[selectedServiceIdx].coverImage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setServicesList((prev) => {
                            const updated = [...prev];
                            updated[selectedServiceIdx] = { ...updated[selectedServiceIdx], coverImage: val };
                            return updated;
                          });
                        }}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Kısa Açıklama</label>
                    <textarea
                      rows={2}
                      value={servicesList[selectedServiceIdx].shortDesc}
                      onChange={(e) => {
                        const val = e.target.value;
                        setServicesList((prev) => {
                          const updated = [...prev];
                          updated[selectedServiceIdx] = { ...updated[selectedServiceIdx], shortDesc: val };
                          return updated;
                        });
                      }}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Detaylı Hizmet Açıklaması</label>
                    <textarea
                      rows={4}
                      value={servicesList[selectedServiceIdx].fullDesc}
                      onChange={(e) => {
                        const val = e.target.value;
                        setServicesList((prev) => {
                          const updated = [...prev];
                          updated[selectedServiceIdx] = { ...updated[selectedServiceIdx], fullDesc: val };
                          return updated;
                        });
                      }}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Gallery Management Section */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Camera size={18} style={{ color: 'var(--primary)' }} />
                        Hizmet Sürecinden Sonra Açılan Fotoğraf Galerisi ({servicesList[selectedServiceIdx].galleryPhotos?.length || 0} Fotoğraf)
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Bu hizmet detay sayfasında kullanıcıların göreceği fotoğrafları ekleyin veya silin.
                      </p>
                    </div>

                    {/* Upload File Button for Gallery */}
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        backgroundColor: 'rgba(201, 170, 103, 0.15)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {uploadingKey === `serviceGallery-${selectedServiceIdx}` ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                      <span>Bilgisayardan Fotoğraf Yükle</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleServiceGalleryFileUpload(selectedServiceIdx, file);
                        }}
                      />
                    </label>
                  </div>

                  {/* Add Photo by URL Input */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                    <input
                      type="text"
                      placeholder="Görsel URL veya bağlantısı yapıştırın..."
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
                    />
                    <button
                      onClick={() => handleAddServiceGalleryPhoto(selectedServiceIdx, newPhotoUrl)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        backgroundColor: 'var(--primary)',
                        color: '#0d0b09',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={16} />
                      <span>Galeriye Ekle</span>
                    </button>
                  </div>

                  {/* Existing Gallery Photos List */}
                  {servicesList[selectedServiceIdx].galleryPhotos && servicesList[selectedServiceIdx].galleryPhotos!.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                      {servicesList[selectedServiceIdx].galleryPhotos!.map((photoUrl, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <div style={{ width: '100%', height: '140px', backgroundColor: '#000', overflow: 'hidden' }}>
                            <img src={getMediaUrl(photoUrl)} alt={`Galeri Fotoğrafı ${pIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>

                          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Foto #{pIdx + 1}</span>
                            <button
                              onClick={() => handleDeleteServiceGalleryPhoto(selectedServiceIdx, pIdx)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Sil</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Henüz bu hizmet için özel galeri fotoğrafı eklenmedi. Yukarıdaki butonlarla fotoğraf ekleyebilirsiniz.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

