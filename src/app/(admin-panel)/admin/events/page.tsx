import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Edit2, ImageIcon, QrCode, Trash2, Calendar } from 'lucide-react';
import { getEventDisplayName } from '@/lib/eventUtils';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  await requireAdmin();

  const events = await prisma.event.findMany({
    where: { status: { not: 'DELETED' } },
    orderBy: { eventDate: 'desc' },
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Taslak';
      case 'PLANNED': return 'Planlandı';
      case 'ACTIVE': return 'Aktif';
      case 'CLOSED_FOR_UPLOAD': return 'Yüklemeye Kapalı';
      case 'ALBUM_PREPARATION': return 'Albüm Hazırlanıyor';
      case 'READY_FOR_DOWNLOAD': return 'İndirmeye Hazır';
      case 'ARCHIVED': return 'Arşivlendi';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'draft';
      case 'PLANNED': return 'planned';
      case 'ACTIVE': return 'active';
      case 'CLOSED_FOR_UPLOAD': return 'closed';
      case 'ALBUM_PREPARATION': return 'prep';
      case 'READY_FOR_DOWNLOAD': return 'download';
      case 'ARCHIVED': return 'archived';
      default: return '';
    }
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Etkinlik Yönetimi</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sistemdeki tüm etkinlikleri yönetin, düzenleyin ve durumlarını takip edin.
          </p>
        </div>
        <Link href="/admin/events/new" className="btn btn-primary">
          <Plus size={16} />
          <span>Yeni Etkinlik Ekle</span>
        </Link>
      </div>

      <div className="section-card">
        {events.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>Henüz Etkinlik Yok</h3>
            <p style={{ marginTop: '8px' }}>QR kodla fotoğraf toplamak için ilk etkinliği oluşturun.</p>
            <Link href="/admin/events/new" className="btn btn-primary mt-20">
              <Plus size={16} />
              <span>İlk Etkinliği Oluştur</span>
            </Link>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Etkinlik Adı</th>
                  <th>Etkinlik Sahibi / Özne</th>
                  <th>Tarih / Saat</th>
                  <th>Mekân</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'center' }}>Fotoğraflar</th>
                  <th>Depolama</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event: any) => {
                  const storageMB = (Number(event.currentStorageBytes) / 1048576).toFixed(2);
                  const displayName = getEventDisplayName(event);
                  return (
                    <tr key={event.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{event.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Kod: {event.shortCode}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          {displayName}
                        </div>
                      </td>
                      <td>
                        <div>{new Date(event.eventDate).toLocaleDateString('tr-TR')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          ⏱️ {event.startTime} - {event.endTime}
                        </div>
                      </td>
                      <td>
                        <div>{event.venueName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {event.city}, {event.district}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Link 
                          href={`/admin/photos?eventId=${event.id}`}
                          style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                        >
                          {event.currentPhotoCount}
                        </Link>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{storageMB} MB</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <Link 
                            href={`/admin/events/${event.id}`} 
                            className="btn btn-secondary btn-sm"
                            title="Etkinliği Düzenle"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <Link 
                            href={`/admin/photos?eventId=${event.id}`} 
                            className="btn btn-secondary btn-sm"
                            title="Fotoğrafları Yönet"
                          >
                            <ImageIcon size={14} />
                          </Link>
                          <Link 
                            href={`/admin/qr?eventId=${event.id}`} 
                            className="btn btn-secondary btn-sm"
                            title="QR Kod Üret"
                          >
                            <QrCode size={14} />
                          </Link>
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
    </div>
  );
}
