'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { 
  Download, 
  Printer, 
  Settings2, 
  BarChart3, 
  Smartphone, 
  Percent, 
  Clock, 
  Users, 
  Image as ImageIcon,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface EventOption {
  id: string;
  title: string;
  displayName?: string;
  shortCode: string;
}

interface StatsData {
  totalScans: number;
  uniqueVisitors: number;
  totalUploaders: number;
  uploadRate: string;
  peakHour: string;
  devices: { type: string; count: number }[];
}

interface QrGeneratorProps {
  events: EventOption[];
  selectedEvent: EventOption | null;
  stats: StatsData | null;
  appUrl: string;
}

export default function QrGenerator({ events, selectedEvent, stats, appUrl }: QrGeneratorProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Origin State (auto detects live browser domain vs server appUrl fallback)
  const [origin, setOrigin] = useState(appUrl);
  const [copied, setCopied] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  // Configuration States
  const [fgColor, setFgColor] = useState('#090d16');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setOrigin(window.location.origin);
    }
  }, [appUrl]);

  const redirectUrl = selectedEvent ? `${origin}/q/${selectedEvent.shortCode}` : '';

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/admin/qr?eventId=${e.target.value}`);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const copyRedirectUrl = () => {
    if (!redirectUrl) return;
    navigator.clipboard.writeText(redirectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Robust Async QR Generator Effect
  useEffect(() => {
    let isMounted = true;
    if (!redirectUrl || !canvasRef.current) return;

    const renderQr = async () => {
      try {
        setQrError(null);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const qrOptions = {
          width: 400,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: fgColor,
            light: transparentBg ? '#00000000' : bgColor,
          },
        };

        // Render QR Code onto canvas
        await QRCode.toCanvas(canvas, redirectUrl, qrOptions);

        // Overlay Logo if provided
        if (logoPreview && isMounted) {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            if (!isMounted || !canvas) return;
            const logoSize = canvas.width * 0.22; // 22% of QR width
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;

            if (!transparentBg) {
              ctx.fillStyle = bgColor;
              ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
            } else {
              ctx.clearRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
            }

            ctx.drawImage(img, x, y, logoSize, logoSize);
          };
          img.onerror = () => {
            console.warn('Logo image could not be loaded into QR canvas');
          };
          img.src = logoPreview;
        }
      } catch (err: any) {
        console.error('QR rendering error:', err);
        if (isMounted) {
          setQrError('QR Kod oluşturulurken bir hata oluştu: ' + (err?.message || 'Geçersiz parametreler'));
        }
      }
    };

    renderQr();

    return () => {
      isMounted = false;
    };
  }, [redirectUrl, fgColor, bgColor, transparentBg, errorLevel, logoPreview]);

  // Download PNG
  const downloadPng = () => {
    if (!canvasRef.current || !selectedEvent) return;
    try {
      const link = document.createElement('a');
      link.download = `${selectedEvent.shortCode}-qr-kod.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  // Download SVG
  const downloadSvg = async () => {
    if (!selectedEvent || !redirectUrl) return;
    try {
      const svgOptions = {
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: transparentBg ? '#00000000' : bgColor,
        },
      };

      const svgString = await QRCode.toString(redirectUrl, {
        type: 'svg',
        ...svgOptions,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = `${selectedEvent.shortCode}-qr-kod.svg`;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Print PDF Layout
  const printPdf = () => {
    if (!canvasRef.current || !selectedEvent) return;

    const qrDataUrl = canvasRef.current.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cleanDisplayUrl = redirectUrl.replace(/^https?:\/\//, '');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedEvent.title} - Masa Kartı</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              text-align: center;
              padding: 40px 20px;
              background-color: #f9fafb;
              color: #111827;
            }
            .card {
              background: #ffffff;
              border: 3px solid #111827;
              border-radius: 24px;
              padding: 40px 30px;
              max-width: 480px;
              margin: 0 auto;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            }
            .header {
              font-size: 28px;
              font-weight: 800;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .divider {
              width: 60px;
              height: 4px;
              background-color: #6366f1;
              border-radius: 2px;
              margin: 16px auto;
            }
            .sub {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 24px;
              color: #374151;
            }
            .qr-container {
              margin: 24px 0;
            }
            .qr-image {
              width: 280px;
              height: 280px;
              border-radius: 12px;
            }
            .instructions {
              font-size: 15px;
              color: #4b5563;
              line-height: 1.6;
              max-width: 380px;
              margin: 20px auto 0;
            }
            .short-link {
              margin-top: 20px;
              font-size: 14px;
              color: #6366f1;
              font-weight: 700;
              word-break: break-all;
            }
            @media print {
              body { padding: 0; background: transparent; }
              .card { border: 2px solid #000; box-shadow: none; padding: 30px; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">Anılarınızı Paylaşın</div>
            <div class="divider"></div>
            <div class="sub">${selectedEvent.title}</div>
            <div class="qr-container">
              <img class="qr-image" src="${qrDataUrl}" alt="QR Code" />
            </div>
            <div class="instructions">
              Kameranızı açıp yukarıdaki QR kodu taratarak düğün albümümüze anında fotoğraf yükleyebilirsiniz. Herhangi bir uygulama yüklemenize gerek yoktur.
            </div>
            <div class="short-link">${cleanDisplayUrl}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>QR Kod Yönetimi</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Etkinliklerin QR kodlarını özelleştirin, yüksek çözünürlüklü indirin veya tarama analizlerini inceleyin.
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="section-card empty-state">
          <ImageIcon size={48} />
          <h3>Henüz Düğün Etkinliği Yok</h3>
          <p style={{ marginTop: '8px' }}>QR Kod oluşturmak için önce bir etkinlik eklemeniz gerekmektedir.</p>
          <button onClick={() => router.push('/admin/events/new')} className="btn btn-primary mt-20">
            Yeni Etkinlik Oluştur
          </button>
        </div>
      ) : (
        <div className="qr-dashboard-grid">
          
          {/* Left Column: Selector & Customizer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Event Selector */}
            <div className="section-card">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="event-select" style={{ fontWeight: 600 }}>Düğün Etkinliği Seçin</label>
                <select
                  id="event-select"
                  className="form-control"
                  value={selectedEvent?.id || ''}
                  onChange={handleEventChange}
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} (Kod: {e.shortCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedEvent && (
              <div className="section-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings2 size={18} style={{ color: 'var(--primary)' }} />
                  <span>QR Tasarım ve Renk Ayarları</span>
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Koyu Renk (Desen)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        style={{ border: 'none', width: '42px', height: '42px', padding: 0, cursor: 'pointer', borderRadius: '6px' }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Açık Renk (Zemin)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        disabled={transparentBg}
                        style={{ border: 'none', width: '42px', height: '42px', padding: 0, cursor: 'pointer', borderRadius: '6px', opacity: transparentBg ? 0.3 : 1 }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        disabled={transparentBg}
                        style={{ fontFamily: 'monospace', textTransform: 'uppercase', opacity: transparentBg ? 0.3 : 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-switch">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Şeffaf Arka Plan</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>QR desenini şeffaf zeminde üretir.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={transparentBg}
                      onChange={(e) => setTransparentBg(e.target.checked)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="error-level">Hata Düzeltme Seviyesi</label>
                    <select
                      id="error-level"
                      className="form-control"
                      value={errorLevel}
                      onChange={(e) => setErrorLevel(e.target.value as any)}
                    >
                      <option value="L">L (%7 - Temel)</option>
                      <option value="M">M (%15 - Standart)</option>
                      <option value="Q">Q (%25 - Yüksek)</option>
                      <option value="H">H (%30 - En Yüksek / Logo Özelliği İçin)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>Merkez Logo Ekle</label>
                  <div 
                    style={{ 
                      display: 'flex', 
                      gap: '15px', 
                      alignItems: 'center',
                      backgroundColor: 'var(--bg-tertiary)',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px dashed var(--border-color)'
                    }}
                  >
                    <div 
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: 'var(--radius-sm)', 
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ImageIcon size={22} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ fontSize: '0.8rem', width: '100%' }}
                      />
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Kare logolar tercih edilir.</p>
                    </div>
                    {logoPreview && (
                      <button type="button" onClick={clearLogo} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}>
                        Kaldır
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Preview, Direct Actions & Analytics */}
          {selectedEvent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* QR Preview Card */}
              <div className="section-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
                
                {qrError ? (
                  <div className="login-error" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <AlertTriangle size={18} />
                    <span>{qrError}</span>
                  </div>
                ) : (
                  <div 
                    style={{ 
                      backgroundColor: transparentBg ? 'rgba(255,255,255,0.02)' : '#ffffff',
                      backgroundImage: transparentBg ? 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)' : 'none',
                      backgroundSize: transparentBg ? '10px 10px' : 'auto',
                      padding: '20px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: '100%'
                    }}
                  >
                    <canvas ref={canvasRef} style={{ width: '220px', height: '220px', maxWidth: '100%' }} />
                  </div>
                )}

                <div style={{ marginTop: '20px', width: '100%' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Misafir Yönlendirme Bağlantısı</div>
                  
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--bg-tertiary)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      marginBottom: '16px'
                    }}
                  >
                    <input 
                      type="text" 
                      readOnly 
                      value={redirectUrl} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--primary)', 
                        fontFamily: 'monospace', 
                        fontSize: '0.8rem',
                        width: '100%',
                        outline: 'none'
                      }} 
                    />
                    <button 
                      onClick={copyRedirectUrl}
                      className="btn btn-secondary btn-sm"
                      style={{ flexShrink: 0, padding: '6px 10px' }}
                      title="Kopyala"
                    >
                      {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                    </button>
                    <a 
                      href={redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ flexShrink: 0, padding: '6px 10px' }}
                      title="Yeni Sekmede Aç"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="form-row">
                    <button onClick={downloadPng} className="btn btn-primary" style={{ width: '100%' }}>
                      <Download size={16} />
                      <span>PNG İndir</span>
                    </button>
                    <button onClick={downloadSvg} className="btn btn-secondary" style={{ width: '100%' }}>
                      <Download size={16} />
                      <span>SVG İndir</span>
                    </button>
                  </div>

                  <button onClick={printPdf} className="btn btn-secondary mt-20" style={{ width: '100%' }}>
                    <Printer size={16} />
                    <span>Masa Kartı Şablonunu Yazdır (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Scan Analytics */}
              {stats && (
                <div className="section-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={18} style={{ color: 'var(--success)' }} />
                    <span>Tarama İstatistikleri</span>
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Users size={12} />
                        <span>Toplam Tarama</span>
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{stats.totalScans}</div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Users size={12} />
                        <span>Tekil Ziyaretçi</span>
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{stats.uniqueVisitors}</div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Percent size={12} />
                        <span>Yükleme Oranı</span>
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>%{stats.uploadRate}</div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Clock size={12} />
                        <span>En Yoğun Saat</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, padding: '2px 0' }}>{stats.peakHour}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Smartphone size={14} />
                      <span>Cihaz Dağılımı</span>
                    </div>
                    {stats.devices.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Henüz tarama verisi kaydolmadı.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {stats.devices.map((device, idx) => {
                          const pct = stats.totalScans > 0 ? (device.count / stats.totalScans) * 100 : 0;
                          return (
                            <div key={idx}>
                              <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>
                                <span>{device.type}</span>
                                <span style={{ fontWeight: 600 }}>{device.count} (%{pct.toFixed(0)})</span>
                              </div>
                              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--primary)', borderRadius: '3px' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}
    </div>
  );
}
