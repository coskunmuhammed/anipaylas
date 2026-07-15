'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  Trash2, 
  RotateCcw, 
  FolderPlus, 
  FolderMinus, 
  Maximize2,
  Trash,
  User,
  MessageSquare,
  Sparkles,
  Calendar,
  AlertCircle,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface PhotoItem {
  id: string;
  eventId: string;
  guestName: string | null;
  guestMessage: string | null;
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  status: string;
  isSelectedForDelivery: boolean;
  uploadedAt: string;
  deletedAt: string | null;
  eventTitle: string;
  signedOriginalUrl: string;
  signedGalleryUrl: string;
  signedThumbnailUrl: string;
}

interface PhotoModeratorProps {
  initialPhotos: PhotoItem[];
  events: { id: string; title: string }[];
  currentEventId: string;
  currentStatus: string;
  currentSearch: string;
  currentSortBy: string;
}

export default function PhotoModerator({
  initialPhotos,
  events,
  currentEventId,
  currentStatus,
  currentSearch,
  currentSortBy,
}: PhotoModeratorProps) {
  const router = useRouter();
  
  // Selection and Lightbox state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter local states
  const [eventId, setEventId] = useState(currentEventId);
  const [status, setStatus] = useState(currentStatus);
  const [search, setSearch] = useState(currentSearch);
  const [sortBy, setSortBy] = useState(currentSortBy);

  // Apply filters to URL
  const applyFilters = (newFilters: { eventId?: string; status?: string; search?: string; sortBy?: string }) => {
    const updated = {
      eventId: newFilters.eventId !== undefined ? newFilters.eventId : eventId,
      status: newFilters.status !== undefined ? newFilters.status : status,
      search: newFilters.search !== undefined ? newFilters.search : search,
      sortBy: newFilters.sortBy !== undefined ? newFilters.sortBy : sortBy,
    };

    const params = new URLSearchParams();
    if (updated.eventId) params.set('eventId', updated.eventId);
    if (updated.status) params.set('status', updated.status);
    if (updated.search) params.set('search', updated.search);
    if (updated.sortBy) params.set('sortBy', updated.sortBy);

    setSelectedIds([]);
    router.push(`/admin/photos?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === initialPhotos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialPhotos.map((p) => p.id));
    }
  };

  // Run moderation actions (bulk or single)
  const runAction = async (photoIds: string[], action: string) => {
    if (photoIds.length === 0) return;
    
    if (action === 'delete_permanent' && !confirm('Seçilen fotoğraflar kalıcı olarak silinecektir. Bu işlem geri alınamaz! Onaylıyor musunuz?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/photos/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoIds, action }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'İşlem gerçekleştirilemedi.');
      } else {
        setSelectedIds([]);
        if (lightboxPhoto && photoIds.includes(lightboxPhoto.id)) {
          setLightboxPhoto(null);
        }
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert('Ağ hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div>
      {/* Header and Controls */}
      <div className="flex-between mb-20">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Fotoğraf Moderasyonu</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Yüklenen fotoğrafları inceleyin, onaylayın, silin veya gelin/damat indirme albümüne ekleyin.
          </p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="section-card mb-20" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 60px', gap: '16px', alignItems: 'end' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Misafir Adı Arama</label>
            <input
              type="text"
              className="form-control"
              placeholder="Misafir adı yazıp Enter'a basın..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Etkinlik Filtresi</label>
            <select
              className="form-control"
              value={eventId}
              onChange={(e) => {
                setEventId(e.target.value);
                applyFilters({ eventId: e.target.value });
              }}
            >
              <option value="">Tüm Etkinlikler</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Onay Durumu</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                applyFilters({ status: e.target.value });
              }}
            >
              <option value="PENDING_APPROVAL">Onay Bekleyenler</option>
              <option value="APPROVED">Onaylananlar (Albüme eklenebilir)</option>
              <option value="REJECTED">Reddedilenler</option>
              <option value="DELETED">Çöp Kutusu (Silinenler)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Sıralama</label>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                applyFilters({ sortBy: e.target.value });
              }}
            >
              <option value="newest">En Yeni Yüklenenler</option>
              <option value="oldest">En Eski Yüklenenler</option>
              <option value="largest">En Büyük Boyutlu</option>
              <option value="smallest">En Küçük Boyutlu</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '40px', padding: 0 }}>
            Ara
          </button>
        </form>
      </div>

      {/* Batch Operations Bar */}
      {selectedIds.length > 0 && (
        <div 
          className="section-card mb-20" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: 'var(--primary-light)',
            borderColor: 'var(--primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input 
              type="checkbox" 
              checked={selectedIds.length === initialPhotos.length}
              onChange={toggleSelectAll}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 600 }}>{selectedIds.length} adet fotoğraf seçildi</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {status === 'PENDING_APPROVAL' && (
              <>
                <button 
                  onClick={() => runAction(selectedIds, 'approve')} 
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                >
                  <Check size={14} />
                  <span>Onayla</span>
                </button>
                <button 
                  onClick={() => runAction(selectedIds, 'reject')} 
                  className="btn btn-secondary btn-sm"
                  disabled={loading}
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                >
                  <X size={14} />
                  <span>Reddet</span>
                </button>
              </>
            )}

            {status === 'APPROVED' && (
              <>
                <button 
                  onClick={() => runAction(selectedIds, 'select_delivery')} 
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                >
                  <FolderPlus size={14} />
                  <span>Albüme Seç</span>
                </button>
                <button 
                  onClick={() => runAction(selectedIds, 'deselect_delivery')} 
                  className="btn btn-secondary btn-sm"
                  disabled={loading}
                >
                  <FolderMinus size={14} />
                  <span>Seçimi Kaldır</span>
                </button>
              </>
            )}

            {status !== 'DELETED' ? (
              <button 
                onClick={() => runAction(selectedIds, 'delete')} 
                className="btn btn-danger btn-sm"
                disabled={loading}
              >
                <Trash2 size={14} />
                <span>Çöpe Taşı</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={() => runAction(selectedIds, 'restore')} 
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                >
                  <RotateCcw size={14} />
                  <span>Geri Yükle</span>
                </button>
                <button 
                  onClick={() => runAction(selectedIds, 'delete_permanent')} 
                  className="btn btn-danger btn-sm"
                  disabled={loading}
                >
                  <Trash size={14} />
                  <span>Kalıcı Olarak Sil</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Photos Grid */}
      {initialPhotos.length === 0 ? (
        <div className="section-card empty-state">
          <ImageIcon size={48} />
          <h3>Kriterlere Uygun Fotoğraf Bulunamadı</h3>
          <p style={{ marginTop: '8px' }}>Farklı bir onay durumu veya etkinlik filtresi seçebilirsiniz.</p>
        </div>
      ) : (
        <>
          {/* Select All checkbox bar when no selection is active */}
          {selectedIds.length === 0 && (
            <div style={{ padding: '0 10px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                id="select-all-checkbox"
                type="checkbox" 
                checked={false}
                onChange={toggleSelectAll}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="select-all-checkbox" style={{ fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                Tümünü Seç (%{initialPhotos.length})
              </label>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {initialPhotos.map((photo) => {
              const isSelected = selectedIds.includes(photo.id);
              return (
                <div 
                  key={photo.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s',
                  }}
                  className="photo-card"
                >
                  {/* Select Checkbox Overlay */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(photo.id)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Delivery Selection Badge Indicator */}
                  {photo.isSelectedForDelivery && (
                    <div 
                      style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        zIndex: 10,
                        backgroundColor: 'var(--success)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Teslim albümüne seçildi"
                    >
                      <Sparkles size={10} />
                      <span>Albüme Seçildi</span>
                    </div>
                  )}

                  {/* Image Frame */}
                  <div 
                    style={{ 
                      width: '100%', 
                      aspectRatio: '1', 
                      backgroundColor: 'var(--bg-tertiary)', 
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => setLightboxPhoto(photo)}
                  >
                    <img 
                      src={photo.signedThumbnailUrl}
                      alt="thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        width: '100%', 
                        padding: '20px 10px 5px', 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        color: 'white'
                      }}
                    >
                      <Maximize2 size={14} style={{ opacity: 0.8 }} />
                    </div>
                  </div>

                  {/* Metadata and details */}
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ minHeight: '34px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {photo.guestName || 'Anonim'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        🎬 {photo.eventTitle}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>⚖️ {formatSize(photo.fileSize)}</span>
                      <span>📏 {photo.width}x{photo.height}</span>
                    </div>

                    {/* Single Photo Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      {status === 'PENDING_APPROVAL' && (
                        <>
                          <button 
                            onClick={() => runAction([photo.id], 'approve')}
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1 }}
                            title="Onayla"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => runAction([photo.id], 'reject')}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                            title="Reddet"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}

                      {status === 'APPROVED' && (
                        <button 
                          onClick={() => runAction([photo.id], photo.isSelectedForDelivery ? 'deselect_delivery' : 'select_delivery')}
                          className={`btn btn-sm ${photo.isSelectedForDelivery ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ flex: 1 }}
                          title={photo.isSelectedForDelivery ? 'Albümden Kaldır' : 'Albüm Teslim Paketine Ekle'}
                        >
                          {photo.isSelectedForDelivery ? <FolderMinus size={14} /> : <FolderPlus size={14} />}
                          <span>{photo.isSelectedForDelivery ? 'Kaldır' : 'Albüme Seç'}</span>
                        </button>
                      )}

                      {status !== 'DELETED' ? (
                        <button 
                          onClick={() => runAction([photo.id], 'delete')}
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: 'var(--danger-light)', color: 'var(--danger)' }}
                          title="Çöpe Taşı"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => runAction([photo.id], 'restore')}
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1 }}
                            title="Geri Yükle"
                          >
                            <RotateCcw size={14} />
                          </button>
                          <button 
                            onClick={() => runAction([photo.id], 'delete_permanent')}
                            className="btn btn-danger btn-sm"
                            title="Kalıcı Sil"
                          >
                            <Trash size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Lightbox / Preview Modal */}
      {lightboxPhoto && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 7, 12, 0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()} // prevent close
          >
            {/* Close Button */}
            <button 
              onClick={() => setLightboxPhoto(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', minHeight: '400px' }}>
              
              {/* Image Preview Box */}
              <div 
                style={{ 
                  backgroundColor: '#000', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '20px',
                  maxHeight: '600px'
                }}
              >
                <img 
                  src={lightboxPhoto.signedGalleryUrl} 
                  alt="lightbox view" 
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>

              {/* Sidebar Info Panel */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Fotoğraf Detayları</h3>
                  <span className={`badge ${lightboxPhoto.status.toLowerCase()}`}>
                    {lightboxPhoto.status === 'PENDING_APPROVAL' ? 'Onay Bekliyor' : 
                     lightboxPhoto.status === 'APPROVED' ? 'Onaylandı' : lightboxPhoto.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <User size={16} style={{ color: 'var(--text-secondary)', marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gönderen Misafir</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lightboxPhoto.guestName || 'Anonim'}</div>
                    </div>
                  </div>

                  {lightboxPhoto.guestMessage && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <MessageSquare size={16} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tebrik Mesajı</div>
                        <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', backgroundColor: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          "{lightboxPhoto.guestMessage}"
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Calendar size={16} style={{ color: 'var(--text-secondary)', marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yükleme Tarihi</div>
                      <div style={{ fontSize: '0.85rem' }}>{new Date(lightboxPhoto.uploadedAt).toLocaleString('tr-TR')}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <AlertCircle size={16} style={{ color: 'var(--text-secondary)', marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dosya Bilgileri</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <div>İsim: {lightboxPhoto.originalFilename}</div>
                        <div>Format: {lightboxPhoto.mimeType}</div>
                        <div>Boyut: {formatSize(lightboxPhoto.fileSize)}</div>
                        <div>Çözünürlük: {lightboxPhoto.width}x{lightboxPhoto.height}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lightbox Actions */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  {lightboxPhoto.status === 'PENDING_APPROVAL' && (
                    <>
                      <button 
                        onClick={() => runAction([lightboxPhoto.id], 'approve')}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        <Check size={16} />
                        <span>Onayla</span>
                      </button>
                      <button 
                        onClick={() => runAction([lightboxPhoto.id], 'reject')}
                        className="btn btn-secondary"
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                      >
                        <X size={16} />
                        <span>Reddet</span>
                      </button>
                    </>
                  )}

                  {lightboxPhoto.status === 'APPROVED' && (
                    <button 
                      onClick={() => runAction([lightboxPhoto.id], lightboxPhoto.isSelectedForDelivery ? 'deselect_delivery' : 'select_delivery')}
                      className={`btn ${lightboxPhoto.isSelectedForDelivery ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ flex: 1 }}
                    >
                      {lightboxPhoto.isSelectedForDelivery ? <FolderMinus size={16} /> : <FolderPlus size={16} />}
                      <span>{lightboxPhoto.isSelectedForDelivery ? 'Albümden Çıkar' : 'Albüm Paketine Seç'}</span>
                    </button>
                  )}

                  {lightboxPhoto.status === 'DELETED' ? (
                    <button 
                      onClick={() => runAction([lightboxPhoto.id], 'restore')}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      <RotateCcw size={16} />
                      <span>Geri Yükle</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => runAction([lightboxPhoto.id], 'delete')}
                      className="btn btn-danger"
                      title="Çöpe Taşı"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
