'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { getEventDisplayName } from '@/lib/eventUtils';

interface ArchivedEvent {
  id: string;
  title: string;
  eventType?: string;
  subjectType?: string;
  brideName?: string | null;
  groomName?: string | null;
  hostName?: string | null;
  eventDate: string;
  currentPhotoCount: number;
}

interface ArchiveListProps {
  events: ArchivedEvent[];
}

export default function ArchiveList({ events }: ArchiveListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (eventId: string, action: 'reactivate' | 'delete') => {
    const confirmMsg = action === 'reactivate' 
      ? 'Bu etkinliği yeniden aktif hale getirmek istiyor musunuz? Misafirler tekrar fotoğraf yükleyebilir.'
      : 'Bu etkinliği tamamen silmek istediğinize emin misiniz? Kayıt silinecektir.';
      
    if (!confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/events/archive-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'İşlem gerçekleştirilemedi.');
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

  return (
    <div>
      <div className="section-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>
          Arşivlenen Etkinlik Albümleri
        </h3>

        {events.length === 0 ? (
          <div className="empty-state">
            <Archive size={48} />
            <p>Arşivde kayıtlı etkinlik albümü bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Etkinlik Adı</th>
                  <th>Etkinlik Sahibi / Özne</th>
                  <th>Tarih</th>
                  <th>Fotoğraf Sayısı</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{event.title}</div>
                    </td>
                    <td>👤 {getEventDisplayName(event)}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.currentPhotoCount} adet fotoğraf</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleAction(event.id, 'reactivate')}
                          className="btn btn-secondary btn-sm"
                          disabled={loading}
                          title="Arşivden Çıkar (Aktifleştir)"
                        >
                          <RotateCcw size={14} />
                          <span>Aktifleştir</span>
                        </button>
                        <button 
                          onClick={() => handleAction(event.id, 'delete')}
                          className="btn btn-danger btn-sm"
                          disabled={loading}
                          title="Etkinliği Sil"
                        >
                          <Trash2 size={14} />
                          <span>Sil</span>
                        </button>
                      </div>
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
