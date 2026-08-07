'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2, 
  MapPin, 
  Sparkles, 
  Loader2, 
  Filter,
  UserCheck
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface ReservationItem {
  id: string;
  coupleNames: string;
  phone: string;
  eventDate?: string;
  city?: string;
  selectedService: string;
  selectedConcept?: string;
  notes?: string;
  status: 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, contacted: 0, confirmed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/reservations?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setReservations(json.data || []);
        if (json.stats) setStats(json.stats);
      }
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReservations();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setReservations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
        );
        fetchReservations();
      }
    } catch (err) {
      alert('Durum güncellenirken hata oluştu.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu rezervasyon talebini silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setReservations((prev) => prev.filter((item) => item.id !== id));
        fetchReservations();
      }
    } catch (err) {
      alert('Silinirken hata oluştu.');
    }
  };

  const getWhatsAppLink = (item: ReservationItem) => {
    const cleanNumber = item.phone.replace(/[^\d]/g, '');
    const msg = encodeURIComponent(`Merhaba ${item.coupleNames}, Didim Palm Stüdyo'dan iletişime geçiyoruz. ${item.selectedService} (${item.selectedConcept || ''}) talebiniz ve fiyat teklifimiz hakkında detayları paylaşmak isteriz.`);
    return `https://wa.me/${cleanNumber.startsWith('90') ? cleanNumber : '90' + cleanNumber}?text=${msg}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }}>⏳ Bekliyor</span>;
      case 'CONTACTED':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>💬 İletişime Geçildi</span>;
      case 'CONFIRMED':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>✅ Onaylandı</span>;
      case 'CANCELLED':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>❌ İptal Edildi</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px 16px 60px 16px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Rezervasyon & Fiyat Talepleri
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Müşterilerinizin online rezervasyon formundan gönderdiği tüm talepleri buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {/* Stats Summary Cards Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>TOPLAM TALEP</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{stats.total}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#eab308', marginBottom: '4px' }}>⏳ BEKLEYEN TALEPLER</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#eab308' }}>{stats.pending}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#60a5fa', marginBottom: '4px' }}>💬 İLETİŞİME GEÇİLENLER</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>{stats.contacted}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399', marginBottom: '4px' }}>✅ ONAYLANAN REZERVASYONLAR</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>{stats.confirmed}</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: 'ALL', label: 'Tüm Talepler' },
            { key: 'PENDING', label: '⏳ Bekleyenler' },
            { key: 'CONTACTED', label: '💬 İletişime Geçilenler' },
            { key: 'CONFIRMED', label: '✅ Onaylananlar' },
            { key: 'CANCELLED', label: '❌ İptal Edilenler' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: statusFilter === tab.key ? 700 : 500,
                backgroundColor: statusFilter === tab.key ? 'var(--primary-light)' : 'var(--bg-secondary)',
                color: statusFilter === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
                border: statusFilter === tab.key ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1 1 240px', maxWidth: '340px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Çift ismi, telefon veya şehir ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.88rem',
              }}
            />
          </div>
        </form>

      </div>

      {/* Main Reservation List */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
          <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary)', marginRight: '12px' }} />
          <span>Talepler yükleniyor...</span>
        </div>
      ) : reservations.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '60px 24px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <Calendar size={48} style={{ color: 'var(--primary)', marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            Henüz Kayıtlı Rezervasyon Talebi Bulunmuyor
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>
            Müşterileriniz anasayfa veya rezervasyon formundan talep gönderdiğinde anında burada listelenecektir.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reservations.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {/* Header Info Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                    {item.coupleNames}
                  </h3>
                  {getStatusBadge(item.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    {new Date(item.createdAt).toLocaleString('tr-TR')}
                  </span>

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#f87171',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={13} /> Sil
                  </button>
                </div>
              </div>

              {/* Grid Content */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '0.88rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>SEÇİLEN HİZMET & KONSEPT</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '2px' }}>{item.selectedService}</div>
                  {item.selectedConcept && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>✨ Konsept: {item.selectedConcept}</div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>TARİH & ŞEHİR</div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{item.eventDate || 'Tarih Belirtilmedi'}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={12} style={{ color: 'var(--primary)' }} />
                    <span>{item.city || 'Didim / Aydın'}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>İLETİŞİM & WHATSAPP</div>
                  <div style={{ color: '#fff', fontWeight: 700, marginBottom: '6px' }}>{item.phone}</div>
                  <a
                    href={getWhatsAppLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      color: '#4ade80',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp İle İletişime Geç</span>
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>DURUM GÜNCELLE</div>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <option value="PENDING">⏳ Bekliyor</option>
                    <option value="CONTACTED">💬 İletişime Geçildi</option>
                    <option value="CONFIRMED">✅ Onaylandı</option>
                    <option value="CANCELLED">❌ İptal Edildi</option>
                  </select>
                </div>
              </div>

              {/* Couple Notes Area */}
              {item.notes && (
                <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--primary)' }}>
                  <strong style={{ color: '#fff' }}>Çift Notu:</strong> {item.notes}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
