'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function CleanupButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCleanup = async () => {
    if (!confirm('Sistem genelinde süresi dolmuş bağlantıları kapatmak, 7 günü geçmiş silinen fotoğrafları diskten kalıcı olarak yok etmek ve 30 günü geçmiş ZIP albüm paketlerini silmek istiyor musunuz?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/cleanup', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Bakım işlemi gerçekleştirilemedi.');
      } else {
        alert(`Bakım işlemi başarıyla tamamlandı:\n\n` + data.reports.join('\n'));
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
    <button 
      onClick={handleCleanup}
      className="btn btn-danger"
      style={{ width: '100%', padding: '12px' }}
      disabled={loading}
    >
      <Trash2 size={16} />
      <span>{loading ? 'Sistem Temizliği Yapılıyor...' : 'Kalıcı Temizlik İşlemini Başlat'}</span>
    </button>
  );
}
