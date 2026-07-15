import Link from 'next/link';
import { Camera, ShieldAlert, Heart, QrCode, Download, FolderArchive } from 'lucide-react';

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: '#090d16',
        color: '#f3f4f6',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%)'
      }}
    >
      <header style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✨ AnıPaylaş
        </div>
        <Link
          href="/admin"
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          Yönetici Paneli
        </Link>
      </header>

      <main style={{ width: '100%', maxWidth: '800px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Heart Icon banner */}
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Heart size={32} fill="#6366f1" />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '20px' }}>
          Kontrollü Düğün QR <br /> Fotoğraf Albümü
        </h1>

        <p style={{ color: '#9ca3af', fontSize: '1.15rem', lineHeight: '1.6', maxWidth: '600px', marginBottom: '40px' }}>
          Düğünlerinizde misafirlerin çektikleri eşsiz kareleri tek bir merkezde toplayın.
          Tamamen platform yöneticisi kontrolündeki güvenli, moderasyonlu albüm sistemi.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '80px' }}>
          <Link
            href="/admin"
            style={{
              padding: '14px 28px',
              backgroundColor: '#6366f1',
              borderRadius: '12px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            Sisteme Giriş Yap
          </Link>
        </div>

        {/* Feature Steps */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '32px' }}>Sistem Nasıl Çalışır?</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'left', width: '100%' }}>

          <div style={{ padding: '24px', backgroundColor: '#111726', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#6366f1', marginBottom: '16px' }}>
              <QrCode size={28} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>1. QR Kod Üretimi</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Yönetici etkinlik oluşturur, benzersiz tasarımda yüksek çözünürlüklü QR kod üretip salondaki masalara yerleştirir.
            </p>
          </div>

          <div style={{ padding: '24px', backgroundColor: '#111726', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#10b981', marginBottom: '16px' }}>
              <Camera size={28} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>2. Misafir Yüklemesi</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Ziyaretçiler üye olmadan QR taratarak telefonlarından fotoğraf yüklerler (video dosyaları kesinlikle engellenir).
            </p>
          </div>

          <div style={{ padding: '24px', backgroundColor: '#111726', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#ef4444', marginBottom: '16px' }}>
              <ShieldAlert size={28} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>3. Moderasyon & Teslim</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Yönetici fotoğrafları onaylar, ZIP paketi hazırlar ve gelin/damat için şifreli, süreli indirme bağlantısı verir.
            </p>
          </div>

        </div>

      </main>

      <footer style={{ marginTop: '100px', color: '#6b7280', fontSize: '0.8rem' }}>
        &copy; {new Date().getFullYear()} AnıPaylaş Düğün Albüm Sistemi. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
