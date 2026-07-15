import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { 
  Calendar, 
  Image as ImageIcon, 
  Database, 
  Link2, 
  Clock, 
  ShieldAlert, 
  Plus,
  Eye
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Ensure authenticated
  await requireAdmin();

  // Date ranges
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Queries
  const totalEvents = await prisma.event.count({
    where: { status: { not: 'DELETED' } },
  });

  const activeEvents = await prisma.event.count({
    where: { status: 'ACTIVE' },
  });

  const todayEventsCount = await prisma.event.count({
    where: {
      eventDate: {
        gte: startOfToday,
        lte: endOfToday,
      },
      status: { not: 'DELETED' },
    },
  });

  const totalPhotos = await prisma.photo.count({
    where: { status: { not: 'DELETED' } },
  });

  const pendingPhotos = await prisma.photo.count({
    where: { status: 'PENDING_APPROVAL' },
  });

  const storageSum = await prisma.photo.aggregate({
    _sum: {
      fileSize: true,
    },
    where: { status: { not: 'DELETED' } },
  });
  
  const storageBytes = Number(storageSum._sum.fileSize || 0);
  let storageDisplay = '0 MB';
  if (storageBytes >= 1073741824) {
    storageDisplay = `${(storageBytes / 1073741824).toFixed(2)} GB`;
  } else {
    storageDisplay = `${(storageBytes / 1048576).toFixed(2)} MB`;
  }

  const activeLinks = await prisma.downloadLink.count({
    where: {
      isActive: true,
      expiresAt: { gte: new Date() },
    },
  });

  // Links expiring in 3 days
  const expiringThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const expiringLinksCount = await prisma.downloadLink.count({
    where: {
      isActive: true,
      expiresAt: {
        gte: new Date(),
        lte: expiringThreeDays,
      },
    },
  });

  // Recent Uploads
  const recentPhotosRaw = await prisma.photo.findMany({
    take: 5,
    orderBy: { uploadedAt: 'desc' },
    where: { status: { not: 'DELETED' } },
    include: { event: true },
  });

  const { getSignedDownloadUrl } = await import('@/lib/storage');

  const recentPhotos = await Promise.all(
    recentPhotosRaw.map(async (photo: any) => {
      const signedThumbnailUrl = photo.thumbnailUrl.startsWith('http')
        ? photo.thumbnailUrl
        : await getSignedDownloadUrl(photo.thumbnailUrl);
      return {
        ...photo,
        signedThumbnailUrl,
      };
    })
  );

  // Recent Events
  const recentEvents = await prisma.event.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    where: { status: { not: 'DELETED' } },
  });

  return (
    <div>
      <div className="flex-between mb-20">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Genel Bakış</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sistem durumunu ve son yüklemeleri buradan izleyebilirsiniz.
          </p>
        </div>
        <Link href="/admin/events/new" className="btn btn-primary">
          <Plus size={16} />
          <span>Yeni Etkinlik Oluştur</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Toplam Etkinlik</span>
          <span className="metric-value">{totalEvents}</span>
          <span className="metric-sub">{activeEvents} adet aktif etkinlik</span>
        </div>

        <div className="metric-card warning">
          <span className="metric-label">Bugünkü Düğünler</span>
          <span className="metric-value">{todayEventsCount}</span>
          <span className="metric-sub">Kayıtlı düğün etkinlikleri</span>
        </div>

        <div className="metric-card success">
          <span className="metric-label">Toplam Fotoğraf</span>
          <span className="metric-value">{totalPhotos}</span>
          <span className="metric-sub">{pendingPhotos} onay bekliyor</span>
        </div>

        <div className="metric-card danger">
          <span className="metric-label">Depolama Kullanımı</span>
          <span className="metric-value">{storageDisplay}</span>
          <span className="metric-sub">Bulut storage alanı kullanımı</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Aktif İndirme Linkleri</span>
          <span className="metric-value">{activeLinks}</span>
          <span className="metric-sub">{expiringLinksCount} link süresi dolmak üzere</span>
        </div>
      </div>

      {/* Lists Section */}
      <div className="dashboard-sections">
        {/* Left: Recent Photos */}
        <div className="section-card">
          <div className="section-title">
            <span>Son Yüklenen Fotoğraflar</span>
            <Link href="/admin/photos" className="btn btn-secondary btn-sm">
              <Eye size={14} />
              <span>Tümünü Gör</span>
            </Link>
          </div>
          
          {recentPhotos.length === 0 ? (
            <div className="empty-state">
              <ImageIcon size={36} />
              <p>Henüz yüklenmiş fotoğraf yok.</p>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Görsel</th>
                    <th>Etkinlik</th>
                    <th>Misafir</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPhotos.map((photo: any) => (
                    <tr key={photo.id}>
                      <td>
                        <div 
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--bg-tertiary)',
                            position: 'relative'
                          }}
                        >
                          {/* We serve thumbnails securely, we will route thumbnail through signed/local API */}
                          <img 
                            src={photo.signedThumbnailUrl}
                            alt="thumbnail"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </td>
                      <td>{photo.event.title}</td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 500 }}>{photo.guestName || 'Anonim'}</div>
                          {photo.guestMessage && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              "{photo.guestMessage}"
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(photo.uploadedAt).toLocaleString('tr-TR')}
                      </td>
                      <td>
                        <span className={`badge ${photo.status.toLowerCase()}`}>
                          {photo.status === 'PENDING_APPROVAL' ? 'Onay Bekliyor' : 
                           photo.status === 'APPROVED' ? 'Onaylandı' : photo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Recent Events */}
        <div className="section-card">
          <div className="section-title">
            <span>Son Etkinlikler</span>
            <Link href="/admin/events" className="btn btn-secondary btn-sm">
              <span>Tümünü Gör</span>
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="empty-state">
              <Calendar size={36} />
              <p>Henüz etkinlik oluşturulmadı.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentEvents.map((event: any) => (
                <div 
                  key={event.id}
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div className="flex-between">
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{event.title}</span>
                    <span className={`badge ${event.status.toLowerCase()}`}>
                      {event.status === 'ACTIVE' ? 'Aktif' : 
                       event.status === 'DRAFT' ? 'Taslak' : 
                       event.status === 'PLANNED' ? 'Planlandı' : event.status}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div>👰 {event.brideName} & 🤵 {event.groomName}</div>
                    <div>📅 {new Date(event.eventDate).toLocaleDateString('tr-TR')}</div>
                    <div>📍 {event.venueName}, {event.city}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <Link href={`/admin/events/${event.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                      Düzenle
                    </Link>
                    <Link href={`/admin/photos?eventId=${event.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      Resimler ({event.currentPhotoCount})
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
