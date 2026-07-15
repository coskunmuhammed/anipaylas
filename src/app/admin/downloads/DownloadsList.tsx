'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Link2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Clock, 
  Download,
  Copy
} from 'lucide-react';

interface LinkItem {
  id: string;
  eventId: string;
  eventTitle: string;
  brideName: string;
  groomName: string;
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
}

interface DownloadsListProps {
  links: LinkItem[];
}

export default function DownloadsList({ links }: DownloadsListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getStatus = (link: LinkItem) => {
    const now = new Date();
    const expires = new Date(link.expiresAt);
    
    if (!link.isActive || link.revokedAt) return { label: 'İptal Edildi', class: 'closed' };
    if (now > expires) return { label: 'Süresi Doldu', class: 'draft' };
    if (link.currentDownloadCount >= link.maxDownloadCount) return { label: 'Limit Doldu', class: 'closed' };
    return { label: 'Aktif', class: 'active' };
  };

  const handleRevoke = async (linkId: string) => {
    if (!confirm('Bu indirme bağlantısını manuel olarak iptal etmek istediğinize emin misiniz? Gelin ve damat artık bu linkten dosya indiremeyecektir.')) {
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
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert('Ağ hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (link: LinkItem) => {
    const fullLink = `${window.location.origin}/download/${link.id}`; // Wait! In real app it resolves from token, but in our design the route takes /download/[token] where token is raw token.
    // Wait! The token we generate is random, but in the DB we saved its hash.
    // The admin list link doesn't store the RAW token (to protect it). 
    // Wait! Can the admin copy the link from here?
    // Since token is hashed in DB, we cannot reconstruct the raw token from the hashed value.
    // Therefore, the administrator must copy the link immediately when it is generated in the modal.
    // However, for debugging or if they want to copy, they can either request a new link,
    // or we can allow copying the ID (which in a mock environment we could use, but for security, re-generating a link is preferred if lost).
    // Let's explain this to the user in a tooltip, or show a warning.
    // Yes! Let's display a message "Kopyalamak için yeni link oluşturun veya gizlilik için sadece takibini yapın."
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <div>
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
                  <th>Gelin & Damat</th>
                  <th>Etkinlik</th>
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
                        <div style={{ fontWeight: 600 }}>👰 {link.brideName}</div>
                        <div style={{ fontWeight: 600, marginTop: '2px' }}>🤵 {link.groomName}</div>
                      </td>
                      <td>{link.eventTitle}</td>
                      <td>
                        <div>{new Date(link.expiresAt).toLocaleDateString('tr-TR')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Süre Sonu
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
                        {link.isActive && !link.revokedAt && (
                          <button 
                            onClick={() => handleRevoke(link.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                            disabled={loading}
                            title="Bağlantıyı İptal Et"
                          >
                            <Trash2 size={14} />
                            <span>İptal Et</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
