'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PackageOpen, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Link2, 
  Plus, 
  X,
  Copy,
  Calendar,
  Lock,
  ChevronRight
} from 'lucide-react';

interface EventOption {
  id: string;
  title: string;
}

interface PackageItem {
  id: string;
  eventId: string;
  status: string;
  photoCount: number;
  archiveStorageKey: string | null;
  archiveSizeBytes: number | null;
  createdAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  linksCount: number;
}

interface DeliveryManagerProps {
  events: EventOption[];
  selectedEvent: EventOption | null;
  packages: PackageItem[];
  stats: { totalApproved: number; totalSelected: number } | null;
}

export default function DeliveryManager({ events, selectedEvent, packages, stats }: DeliveryManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auto-refresh when any package is in PROCESSING state
  useEffect(() => {
    const hasProcessing = packages.some((p) => p.status === 'PROCESSING');
    if (hasProcessing) {
      const timer = setInterval(() => {
        router.refresh();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [packages, router]);
  
  // Modal states
  const [showLinkModal, setShowLinkModal] = useState<PackageItem | null>(null);
  const [expiryOption, setExpiryOption] = useState('7'); // '7', '15', '30', 'custom'
  const [customExpiryDate, setCustomExpiryDate] = useState('');
  const [maxDownloads, setMaxDownloads] = useState(10);
  const [password, setPassword] = useState('');
  
  // Success states
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/admin/delivery?eventId=${e.target.value}`);
  };

  const handleGenerateZip = async () => {
    if (!selectedEvent) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/delivery/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEvent.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'ZIP oluşturulurken bir hata oluştu.');
      } else {
        alert('ZIP paketi hazırlama görevi arka planda başlatıldı. Durumu aşağıdan takip edebilirsiniz.');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('Ağ hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showLinkModal || !selectedEvent) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/delivery/link/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          deliveryPackageId: showLinkModal.id,
          expiryOption,
          customExpiryDate,
          maxDownloads,
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'İndirme bağlantısı oluşturulamadı.');
      } else {
        const fullLink = `${window.location.origin}/download/${data.token}`;
        setGeneratedLink(fullLink);
      }
    } catch (err) {
      console.error(err);
      setError('Ağ hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const closeLinkModal = () => {
    setShowLinkModal(null);
    setGeneratedLink(null);
    setExpiryOption('7');
    setCustomExpiryDate('');
    setMaxDownloads(10);
    setPassword('');
    setError(null);
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Albüm Hazırlama & Teslim</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Düğün bittiğinde fotoğrafları paketleyin (ZIP) ve gelin/damada özel indirme linkleri oluşturun.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Card: Select Event & Prepare ZIP */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="section-card">
            <div className="form-group">
              <label htmlFor="event-select" style={{ fontWeight: 600 }}>Düğün Etkinliği Seçin</label>
              <select
                id="event-select"
                className="form-control"
                value={selectedEvent?.id || ''}
                onChange={handleEventChange}
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            {selectedEvent && stats ? (
              <div 
                style={{ 
                  marginTop: '20px', 
                  padding: '16px', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div className="flex-between">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Onaylanmış Fotoğraflar:</span>
                  <span style={{ fontWeight: 700 }}>{stats.totalApproved} adet</span>
                </div>
                <div className="flex-between">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Öne Çıkanlar (Gelin & Damat Seçimi):</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>{stats.totalSelected} adet</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
                  <button 
                    onClick={handleGenerateZip}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px' }}
                    disabled={loading || stats.totalApproved === 0}
                  >
                    <PackageOpen size={16} />
                    <span>{loading ? 'İşleniyor...' : 'Düğün Albüm ZIP Paketini Hazırla'}</span>
                  </button>
                  {stats.totalApproved === 0 && (
                    <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '6px', textAlign: 'center' }}>
                      Albüm hazırlamak için onaylanmış fotoğraf bulunmalıdır.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Etkinlik bulunamadı.</p>
              </div>
            )}
          </div>

          {error && <div className="login-error">{error}</div>}

        </div>

        {/* Right Card: Previous Packages list */}
        {selectedEvent && (
          <div className="section-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>
              Daha Önce Hazırlanan Albüm Paketleri (ZIP)
            </h3>

            {packages.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <PackageOpen size={36} />
                <p>Henüz albüm paketi oluşturulmadı.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {pkg.status === 'PROCESSING' && (
                        <div style={{ color: 'var(--warning)', display: 'flex', animation: 'spin 1.5s linear infinite' }}>
                          <RefreshCw size={24} />
                          <style>{`@keyframes spin { 100% { transform: rotate(-360deg); } }`}</style>
                        </div>
                      )}
                      {pkg.status === 'COMPLETED' && <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />}
                      {pkg.status === 'FAILED' && <XCircle size={24} style={{ color: 'var(--danger)' }} />}

                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Paket #{pkg.id.substring(0, 8)}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                            ({pkg.photoCount} Fotoğraf)
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Oluşturulma: {new Date(pkg.createdAt).toLocaleString('tr-TR')}
                        </div>
                        {pkg.status === 'COMPLETED' && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Dosya Boyutu: {formatSize(pkg.archiveSizeBytes)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {pkg.status === 'COMPLETED' && (
                        <button 
                          onClick={() => setShowLinkModal(pkg)}
                          className="btn btn-primary btn-sm"
                        >
                          <Link2 size={14} />
                          <span>Bağlantı Oluştur</span>
                        </button>
                      )}
                      {pkg.status === 'PROCESSING' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 600 }}>
                          Hazırlanıyor...
                        </span>
                      )}
                      {pkg.status === 'FAILED' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>
                          Hata Oluştu
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Download Link Generator Modal */}
      {showLinkModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '450px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              position: 'relative'
            }}
          >
            <button 
              onClick={closeLinkModal}
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
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link2 size={20} style={{ color: 'var(--primary)' }} />
              <span>Gelin & Damat İndirme Bağlantısı</span>
            </h3>

            {generatedLink ? (
              /* Success View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '10px 0' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--success)', margin: '0 auto 10px' }} />
                
                <h4 style={{ fontWeight: 700 }}>Bağlantı Başarıyla Oluşturuldu!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Aşağıdaki güvenli bağlantıyı kopyalayarak gelin ve damada WhatsApp veya SMS üzerinden iletebilirsiniz.
                </p>

                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    padding: '10px 14px', 
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginTop: '8px'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {generatedLink}
                  </span>
                  <button onClick={copyToClipboard} className="btn btn-secondary btn-sm" style={{ padding: '6px' }} title="Panoya Kopyala">
                    <Copy size={14} />
                  </button>
                </div>
                {copied && <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Bağlantı kopyalandı!</span>}

                <div style={{ marginTop: '20px' }}>
                  <button onClick={closeLinkModal} className="btn btn-primary" style={{ width: '100%' }}>
                    Kapat
                  </button>
                </div>
              </div>
            ) : (
              /* Config Form View */
              <form onSubmit={handleCreateLink}>
                
                <div className="form-group">
                  <label htmlFor="expiry-select">Bağlantı Geçerlilik Süresi</label>
                  <select
                    id="expiry-select"
                    className="form-control"
                    value={expiryOption}
                    onChange={(e) => setExpiryOption(e.target.value)}
                  >
                    <option value="7">7 Gün (Önerilen)</option>
                    <option value="15">15 Gün</option>
                    <option value="30">30 Gün</option>
                    <option value="custom">Özel Tarih Seç</option>
                  </select>
                </div>

                {expiryOption === 'custom' && (
                  <div className="form-group">
                    <label htmlFor="custom-date">Özel Son Geçerlilik Tarihi</label>
                    <input
                      id="custom-date"
                      type="date"
                      className="form-control"
                      value={customExpiryDate}
                      onChange={(e) => setCustomExpiryDate(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="max-dl">Maksimum İndirme Sayısı</label>
                  <input
                    id="max-dl"
                    type="number"
                    className="form-control"
                    value={maxDownloads}
                    onChange={(e) => setMaxDownloads(parseInt(e.target.value) || 0)}
                    required
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Belirlenen indirme limitine ulaşıldığında link otomatik kapanır.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="pass">Şifre Koruması (İsteğe Bağlı)</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      id="pass"
                      type="text"
                      className="form-control"
                      placeholder="Giriş şifresi belirleyin (örn: 1234)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingLeft: '34px' }}
                    />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Boş bırakılırsa link şifresiz olacaktır.</p>
                </div>

                {error && <div className="login-error" style={{ fontSize: '0.8rem', padding: '8px' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                  <button type="button" onClick={closeLinkModal} className="btn btn-secondary" style={{ flex: 1 }}>
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                    {loading ? 'Oluşturuluyor...' : 'Bağlantı Oluştur'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
