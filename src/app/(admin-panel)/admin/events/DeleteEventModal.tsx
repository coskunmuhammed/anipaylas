'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    shortCode: string;
  };
  onSuccess?: () => void;
}

export default function DeleteEventModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: DeleteEventModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/events/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Etkinlik silinemedi.');
      } else {
        setSuccessMsg(data.message || 'Etkinlik başarıyla silindi.');
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      setError('Ağ hatası veya sunucuya erişilemiyor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--card-bg, #1e1e2d)',
          border: '1px solid var(--border-color, #2b2b40)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color, #2b2b40)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger, #ef4444)' }}>
            <Trash2 size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Etkinliği Kalıcı Olarak Sil</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary, #94a3b8)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {error && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--danger, #ef4444)',
                borderRadius: '8px',
                color: 'var(--danger, #ef4444)',
                fontSize: '0.88rem',
              }}
            >
              {error}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 14px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--success, #10b981)',
                borderRadius: '8px',
                color: 'var(--success, #10b981)',
                fontSize: '0.88rem',
              }}
            >
              {successMsg}
            </div>
          )}

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px dashed var(--danger, #ef4444)',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={24} style={{ color: 'var(--danger, #ef4444)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
              <strong>"{event.title}"</strong> ({event.shortCode}) etkinliğini kalıcı olarak silmek üzeresiniz.
              <br /><br />
              <span style={{ color: 'var(--danger, #ef4444)', fontWeight: 600 }}>
                Bu işlem etkinliğe bağlı tüm fotoğrafları, QR verilerini, oturumları ve teslimat verilerini silebilir ve GERİ ALINAMAZ.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: 'var(--bg-tertiary, #151521)',
            borderTop: '1px solid var(--border-color, #2b2b40)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn btn-secondary"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-danger"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--danger, #ef4444)', color: '#fff' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            <span>{loading ? 'Siliniyor...' : 'Evet, Kalıcı Olarak Sil'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
