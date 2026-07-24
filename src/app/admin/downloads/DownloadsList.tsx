'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Link2, 
  CheckCircle2, 
  Trash2, 
  Download,
  Copy,
  ExternalLink,
  RefreshCw,
  Info,
  X
} from 'lucide-react';

interface LinkItem {
  id: string;
  eventId: string;
  eventTitle: string;
  displayName: string;
  packageId: string;
  photoCount: number;
  packageSize: number;
  isActive: boolean;
  expiresAt: string;
  maxDownloadCount: number;
  currentDownloadCount: number;
  lastDownloadedAt: string | null;
  createdAt: string;
  revokedAt: string | null;
  rawToken: string | null;
  needsRegeneration: boolean;
}

interface DownloadsListProps {
  links: LinkItem[];
}

export default function DownloadsList({ links }: DownloadsListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDetailLink, setSelectedDetailLink] = useState<LinkItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const getStatus = (link: LinkItem) => {
    if (link.needsRegeneration) {
      return { label: 'Yeniden Oluşturulması Gerekiyor', class: 'prep' };
    }

    const now = new Date();
    const expires = new Date(link.expiresAt);
    
    if (!link.isActive || link.revokedAt) return { label: 'İptal Edildi', class: 'closed' };
    if (now > expires) return { label: 'Süresi Doldu', class: 'draft' };
    if (link.currentDownloadCount >= link.maxDownloadCount) return { label: 'Limit Doldu', class: 'closed' };
    return { label: 'Aktif', class: 'active' };
  };

  const getRemainingDays = (expiresAtStr: string) => {
    const now = new Date().getTime();
    const expires = new Date(expiresAtStr).getTime();
    const diff = expires - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleCopyLink = (link: LinkItem) => {
    if (link.needsRegeneration || !link.rawToken) {
      alert('Bu indirme bağlantısı eski formattadır. Lütfen kopyalamadan önce "Yeni Link Oluştur" butonuna basın.');
      return;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/download/${link.rawToken}`;
    navigator.clipboard.writeText(fullUrl);
    showToast('Bağlantı panoya kopyalandı.');
  };

  const handleOpenLink = (link: LinkItem) => {
    if (link.needsRegeneration || !link.rawToken) {
      alert('Bu indirme bağlantısı eski formattadır. Lütfen açmadan önce "Yeni Link Oluştur" butonuna basın.');
      return;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/download/${link.rawToken}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const handleRegenerate = async (link: LinkItem) => {
    if (!confirm('Yeni bir indirme bağlantısı oluşturmak istediğinize emin misiniz? Eski bağlantı iptal edilecek ve çalışmayacaktır.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/delivery/link/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: link.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Yeni bağlantı oluşturulamadı.');
      } else {
        showToast('Yeni indirme bağlantısı oluşturuldu.');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert('Ağ hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (linkId: string) => {
    if (!confirm('Bu indirme bağlantısını manuel olarak pasif yapmak istediğinize emin misiniz? Etkinlik sahibi artık bu linkten dosya indiremeyecektir.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/delivery/link/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Bağlantı iptal edilemedi.');
      } else {
        showToast('Bağlantı pasif hale getirildi.');
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
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <div>
      {/* Toast Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--success)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="section-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>
          Tüm Albüm İndirme Bağlantıları
        </h3>

        {links.length === 0 ? (
          <div className="empty-state">
            <Link2 size={48} />
            <p>Henüz aktif veya geçmiş indirme bağlantısı bulunmuyor.</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Etkinlik Sahibi / Özne</th>
                  <th>Etkinlik Başlığı</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>İndirme Sayısı</th>
                  <th>ZIP Boyutu</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => {
                  const statusInfo = getStatus(link);
                  return (
                    <tr key={link.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>👤 {link.displayName}</div>
                      </td>
                      <td>{link.eventTitle}</td>
                      <td>
                        <div>{new Date(link.expiresAt).toLocaleDateString('tr-TR')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {getRemainingDays(link.expiresAt)} gün kaldı
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Download size={14} style={{ color: 'var(--text-secondary)' }} />
                          <span style={{ fontWeight: 600 }}>{link.currentDownloadCount}</span>
                          <span style={{ color: 'var(--text-muted)' }}>/ {link.maxDownloadCount}</span>
                        </div>
                        {link.lastDownloadedAt && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Son: {new Date(link.lastDownloadedAt).toLocaleString('tr-TR')}
                          </div>
                        )}
                      </td>
                      <td>
                        <div>{formatSize(link.packageSize)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {link.photoCount} Görsel
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          
                          {/* Detay Butonu */}
                          <button
                            onClick={() => setSelectedDetailLink(link)}
                            className="btn btn-secondary btn-sm"
                            title="Bağlantı Detayları"
                          >
                            <Info size={14} />
                          </button>

                          {/* Kopyala */}
                          <button 
                            onClick={() => handleCopyLink(link)}
                            className="btn btn-secondary btn-sm"
                            disabled={link.needsRegeneration}
                            title="Bağlantıyı Kopyala"
                          >
                            <Copy size={14} />
                            <span>Kopyala</span>
                          </button>

                          {/* Aç */}
                          <button 
                            onClick={() => handleOpenLink(link)}
                            className="btn btn-secondary btn-sm"
                            disabled={link.needsRegeneration}
                            title="Bağlantıyı Aç"
                          >
                            <ExternalLink size={14} />
                            <span>Aç</span>
                          </button>

                          {/* Yeniden Oluştur */}
                          <button 
                            onClick={() => handleRegenerate(link)}
                            className="btn btn-secondary btn-sm"
                            disabled={loading}
                            title="Yeni Link Oluştur"
                          >
                            <RefreshCw size={14} />
                            <span>Yeni Link</span>
                          </button>

                          {/* Pasif Yap */}
                          {link.isActive && !link.revokedAt && (
                            <button 
                              onClick={() => handleRevoke(link.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                              disabled={loading}
                              title="Bağlantıyı Pasif Yap"
                            >
                              <Trash2 size={14} />
                              <span>Pasif Yap</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Download Link Detail Modal (Requirement 10) */}
      {selectedDetailLink && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div className="modal-content section-card" style={{ maxWidth: '520px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setSelectedDetailLink(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              İndirme Bağlantısı Detayları
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Etkinlik: </span>
                <strong>{selectedDetailLink.eventTitle}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Etkinlik Sahibi: </span>
                <strong>{selectedDetailLink.displayName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Oluşturulma Tarihi: </span>
                <span>{new Date(selectedDetailLink.createdAt).toLocaleString('tr-TR')}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Son Kullanma Tarihi: </span>
                <span>{new Date(selectedDetailLink.expiresAt).toLocaleString('tr-TR')}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Kalan Gün Süresi: </span>
                <span className="badge active">{getRemainingDays(selectedDetailLink.expiresAt)} Gün</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Toplam Fotoğraf Sayısı: </span>
                <strong>{selectedDetailLink.photoCount} Fotoğraf</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>ZIP Dosya Boyutu: </span>
                <strong>{formatSize(selectedDetailLink.packageSize)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Kaç Defa İndirildi: </span>
                <strong>{selectedDetailLink.currentDownloadCount} / {selectedDetailLink.maxDownloadCount} İndirme</strong>
              </div>
              {selectedDetailLink.lastDownloadedAt && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Son İndirme Tarihi: </span>
                  <span>{new Date(selectedDetailLink.lastDownloadedAt).toLocaleString('tr-TR')}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  handleCopyLink(selectedDetailLink);
                }} 
                className="btn btn-primary"
                disabled={selectedDetailLink.needsRegeneration}
              >
                <Copy size={16} />
                <span>Bağlantıyı Kopyala</span>
              </button>
              <button 
                onClick={() => setSelectedDetailLink(null)} 
                className="btn btn-secondary"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
