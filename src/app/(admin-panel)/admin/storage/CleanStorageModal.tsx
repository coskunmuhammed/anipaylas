'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HardDriveDownload, AlertTriangle, X, Loader2, RefreshCw } from 'lucide-react';

interface CleanStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    shortCode: string;
    currentPhotoCount: number;
  };
  onSuccess?: () => void;
}

export default function CleanStorageModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: CleanStorageModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCleanStorage = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/storage/clean-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Depolama alanı temizlenemedi.');
      } else {
        setSuccessMsg(data.message || 'Depolama alanı başarıyla temizlendi.');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--warning, #f59e0b)' }}>
            <HardDriveDownload size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Etkinlik Depolamasını Temizle</h3>
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
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px dashed var(--warning, #f59e0b)',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={24} style={{ color: 'var(--warning, #f59e0b)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
              <strong>"{event.title}"</strong> ({event.shortCode}) etkinliğinin depolamasını temizlemek üzeresiniz.
              <br /><br />
              <span style={{ color: 'var(--text-primary, #f8fafc)', fontWeight: 600 }}>
                Bu işlem ETKİNLİĞİ SİLMEZ. Etkinliğe yüklenen tüm fotoğrafları ({event.currentPhotoCount} adet) ve ZIP paketlerini kalıcı olarak temizler.
              </span>
              <br /><br />
              Etkinlik QR kodu ve ayarları aktif ve yeniden kullanılabilir kalacaktır.
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
            onClick={handleCleanStorage}
            disabled={loading}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--warning, #f59e0b)', color: '#000', fontWeight: 600 }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>{loading ? 'Temizleniyor...' : 'Depolamayı Temizle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
