import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { ScrollText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLogsPage() {
  await requireAdmin();

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { adminUser: true },
  });

  return (
    <div>
      <div className="flex-between mb-20">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Audit Log (Sistem Günlükleri)</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Yöneticiler tarafından gerçekleştirilen son 50 kritik işlemi inceleyin.
          </p>
        </div>
      </div>

      <div className="section-card">
        {logs.length === 0 ? (
          <div className="empty-state">
            <ScrollText size={48} />
            <p>Sistemde henüz bir günlük kaydı bulunmuyor.</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Yönetici</th>
                  <th>İşlem (Eylem)</th>
                  <th>Etkilenen Model</th>
                  <th>Referans ID</th>
                  <th>Metadata (Detaylar)</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.adminUser?.name || 'Sistem / Anonim'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.adminUser?.email || ''}</div>
                    </td>
                    <td>
                      <span className="badge active" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.entityType}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.entityId || '-'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.metadata || ''}>
                      {log.metadata || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
