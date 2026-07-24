import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import CleanupButton from './CleanupButton';
import { getEventDisplayName } from '@/lib/eventUtils';
import { Database, AlertTriangle, Trash2, FolderArchive, Server } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminStoragePage() {
  await requireAdmin();

  // Storage analytics
  const photosSum = await prisma.photo.aggregate({
    _sum: { fileSize: true },
    where: { deletedAt: null },
  });
  const activePhotosBytes = Number(photosSum._sum.fileSize || 0);

  const softDeletedCount = await prisma.photo.count({
    where: { status: 'DELETED' },
  });

  const softDeletedSum = await prisma.photo.aggregate({
    _sum: { fileSize: true },
    where: { status: 'DELETED' },
  });
  const softDeletedBytes = Number(softDeletedSum._sum.fileSize || 0);

  const packages = await prisma.deliveryPackage.findMany({
    where: { status: 'COMPLETED', deletedAt: null },
    select: { archiveSizeBytes: true },
  });
  const activeZipsBytes = packages.reduce((sum: number, pkg: any) => sum + Number(pkg.archiveSizeBytes || 0), 0);

  const totalCalculatedBytes = activePhotosBytes + softDeletedBytes + activeZipsBytes;

  const events = await prisma.event.findMany({
    where: { status: { not: 'DELETED' } },
    orderBy: { currentStorageBytes: 'desc' },
  });

  const formatSize = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Depolama Yönetimi</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sunucu ve bulut depolama alanı kullanımını takip edin, süresi dolan dosyaları temizleyin.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Server size={14} />
            <span>Toplam Depolama</span>
          </span>
          <span className="metric-value">{formatSize(totalCalculatedBytes)}</span>
          <span className="metric-sub">Fotoğraf + ZIP paketleri toplamı</span>
        </div>

        <div className="metric-card success">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Database size={14} />
            <span>Aktif Fotoğraflar</span>
          </span>
          <span className="metric-value">{formatSize(activePhotosBytes)}</span>
          <span className="metric-sub">Sistemde yayında olan görseller</span>
        </div>

        <div className="metric-card warning">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Trash2 size={14} />
            <span>Çöp Kutusu</span>
          </span>
          <span className="metric-value">{formatSize(softDeletedBytes)}</span>
          <span className="metric-sub">{softDeletedCount} adet çöp kutusunda fotoğraf</span>
        </div>

        <div className="metric-card danger">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FolderArchive size={14} />
            <span>Teslim Paketleri</span>
          </span>
          <span className="metric-value">{formatSize(activeZipsBytes)}</span>
          <span className="metric-sub">{packages.length} adet hazırlanan ZIP paketi</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Events storage list */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>
            Etkinlik Bazlı Depolama Kullanımı
          </h3>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Etkinlik Adı</th>
                  <th>Kayıt Sayısı</th>
                  <th>Kullanım</th>
                  <th>Limit / Kota</th>
                  <th>Doluluk Oranı</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event: any) => {
                  const storageUsedBytes = Number(event.currentStorageBytes);
                  const storageLimitBytes = Number(event.maxStorageBytes);
                  const usagePct = storageLimitBytes > 0 ? (storageUsedBytes / storageLimitBytes) * 100 : 0;
                  
                  return (
                    <tr key={event.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{event.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getEventDisplayName(event)}</div>
                      </td>
                      <td>{event.currentPhotoCount} adet</td>
                      <td>{formatSize(storageUsedBytes)}</td>
                      <td>{formatSize(storageLimitBytes)}</td>
                      <td>
                        <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 600 }}>%{usagePct.toFixed(1)}</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${Math.min(usagePct, 100)}%`, 
                              backgroundColor: usagePct > 90 ? 'var(--danger)' : usagePct > 70 ? 'var(--warning)' : 'var(--success)', 
                              borderRadius: '3px' 
                            }} 
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Maintenance & Cleanup */}
        <div className="section-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
            <span>Sistem Temizlik ve Bakım</span>
          </h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
            Depolama maliyetlerini azaltmak ve sistem performansını artırmak amacıyla elle veya otomatik bakım görevlerini tetikleyebilirsiniz.
          </p>

          <div 
            style={{ 
              padding: '16px', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ fontWeight: 600 }}>Bakım Kuralları:</div>
            <div>🗑️ Çöp kutusuna atılan fotoğraflar <strong>7 gün</strong> sonra kalıcı olarak silinir.</div>
            <div>📦 Gelin ve damat için hazırlanan ZIP dosyaları <strong>30 gün</strong> sonra diskten silinir.</div>
            <div>🔗 Süresi dolan indirme bağlantıları otomatik olarak erişime kapatılır.</div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <CleanupButton />
          </div>
        </div>

      </div>
    </div>
  );
}
