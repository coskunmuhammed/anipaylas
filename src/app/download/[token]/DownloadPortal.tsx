'use client';

import React, { useState } from 'react';
import { Download, AlertCircle, HelpCircle, Lock } from 'lucide-react';

interface DownloadData {
  token: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  coverImageUrl: string | null;
  photoCount: number;
  archiveSizeBytes: number;
  expiresAt: string;
  remainingDays: number;
  passwordRequired: boolean;
}

interface DownloadPortalProps {
  data: DownloadData;
  isExpired: boolean;
  statusMessage: string;
}

export default function DownloadPortal({ data, isExpired, statusMessage }: DownloadPortalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/download/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: data.token,
          password: password.trim(),
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.error || 'İndirme işlemi başarısız.');
      } else {
        // Trigger file download immediately
        const link = document.createElement('a');
        link.href = responseData.downloadUrl;
        link.download = `${data.brideName}-${data.groomName}-Dugun-Fotograflari.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
      setError('Ağ hatası oluştu, lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="dl-wrapper">
      <div className="dl-container">
        
        {/* Cover Image banner */}
        <div className="dl-cover">
          {data.coverImageUrl && (
            <img 
              src={data.coverImageUrl}
              alt="wedding cover banner" 
            />
          )}
        </div>

        <div className="dl-content">
          <h1 className="dl-title">{data.brideName} & {data.groomName}</h1>
          <div className="dl-wedding-date">Düğün Fotoğraf Arşivi</div>

          {isExpired ? (
            /* Expired Link Layout */
            <div>
              <div 
                className="dl-error" 
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                  borderColor: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--d-danger)',
                  padding: '24px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <AlertCircle size={32} />
                <h3 style={{ fontWeight: 700 }}>İndirme Süresi Sona Erdi</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.5', textAlign: 'center' }}>
                  {statusMessage}
                </p>
              </div>

              <div className="dl-support">
                <HelpCircle size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                <span>Destek veya yeniden erişim için platform yöneticisi ile iletişime geçebilirsiniz.</span>
              </div>
            </div>
          ) : (
            /* Active Link Layout */
            <div>
              <p className="dl-message">
                Düğününüzde misafirleriniz tarafından paylaşılan tüm fotoğraflar hazırlandı ve tek bir albüm paketinde toplandı. 
                Albümünüzü <strong>{data.expiresAt}</strong> tarihine kadar ({data.remainingDays} gün kaldı) indirebilirsiniz.
              </p>

              {/* Stats Grid */}
              <div className="dl-stats-grid">
                <div className="dl-stat-box">
                  <div className="dl-stat-label">Toplam Fotoğraf</div>
                  <div className="dl-stat-val">{data.photoCount}</div>
                </div>
                <div className="dl-stat-box">
                  <div className="dl-stat-label">Dosya Boyutu</div>
                  <div className="dl-stat-val">{formatSize(data.archiveSizeBytes)}</div>
                </div>
              </div>

              {error && <div className="dl-error">{error}</div>}

              {/* Download Form */}
              <form onSubmit={handleDownload}>
                {data.passwordRequired && (
                  <div className="dl-form-group">
                    <label htmlFor="dl-password">Albüm Şifresi</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--d-text-muted)' }} />
                      <input
                        id="dl-password"
                        type="password"
                        className="dl-control"
                        placeholder="Şifreyi giriniz"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                        required
                      />
                    </div>
                  </div>
                )}

                <button type="submit" className="dl-btn" disabled={loading}>
                  <Download size={18} />
                  <span>{loading ? 'Dosya Hazırlanıyor...' : 'Albümü İndir (ZIP)'}</span>
                </button>
              </form>

              <div className="dl-support">
                <span>⚠️ İndirme işlemi dosya boyutuna bağlı olarak zaman alabilir. Lütfen internet bağlantınızı kesmeyin.</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
