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
  Image as ImageIcon 
} from 'lucide-react';

interface EventOption {
  id: string;
  title: string;
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

  // Configuration States
  const [fgColor, setFgColor] = useState('#090d16');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const redirectUrl = selectedEvent ? `${appUrl}/q/${selectedEvent.shortCode}` : '';

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

  // Generate/Draw QR code
  useEffect(() => {
    if (!redirectUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    const qrOptions = {
      width: 400,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: {
        dark: fgColor,
        light: transparentBg ? '#00000000' : bgColor,
      },
    };

    QRCode.toCanvas(canvas, redirectUrl, qrOptions, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      // If a logo is selected, draw it in the center
      if (logoPreview) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
          const logoSize = canvas.width * 0.22; // 22% of QR code width
          const x = (canvas.width - logoSize) / 2;
          const y = (canvas.height - logoSize) / 2;

          // Draw a background rectangle under the logo to clear the QR blocks
          ctx.fillStyle = transparentBg ? 'transparent' : bgColor;
          if (!transparentBg) {
            ctx.fillRect(x - 3, y - 3, logoSize + 6, logoSize + 6);
          } else {
            // Draw clear rect in transparent background, then fill background base
            ctx.clearRect(x - 3, y - 3, logoSize + 6, logoSize + 6);
            ctx.fillStyle = '#ffffff'; // Fallback solid background for logo inside transparent QR
            ctx.fillRect(x - 3, y - 3, logoSize + 6, logoSize + 6);
          }

          // Draw the rounded/bordered logo
          ctx.drawImage(img, x, y, logoSize, logoSize);
        };
        img.src = logoPreview;
      }
    });

  }, [redirectUrl, fgColor, bgColor, transparentBg, errorLevel, logoPreview]);

  // Download PNG
  const downloadPng = () => {
    if (!canvasRef.current || !selectedEvent) return;
    const link = document.createElement('a');
    link.download = `${selectedEvent.shortCode}-qr-kod.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
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

    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedEvent.title} - Masa Kartı</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              text-align: center;
              padding: 50px;
              background-color: white;
              color: black;
            }
            .card {
              border: 3px solid #000;
              border-radius: 24px;
              padding: 40px;
              max-width: 500px;
              margin: 0 auto;
              box-shadow: 0 0 20px rgba(0,0,0,0.05);
            }
            .header {
              font-size: 28px;
              font-weight: 800;
              margin-bottom: 5px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .divider {
              width: 60px;
              height: 3px;
              background-color: black;
              margin: 15px auto;
            }
            .sub {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 25px;
              color: #444;
            }
            .qr-container {
              margin: 30px 0;
            }
            .qr-image {
              width: 300px;
              height: 300px;
            }
            .instructions {
              font-size: 15px;
              color: #555;
              line-height: 1.5;
              max-width: 400px;
              margin: 20px auto 0;
            }
            .short-link {
              margin-top: 15px;
              font-size: 13px;
              color: #999;
              font-weight: bold;
            }
            @media print {
              body { padding: 0; }
              .card { border: none; box-shadow: none; padding: 20px; }
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
              Kameranızı açıp yukarıdaki QR kodu taratarak düğün albümümüze anında fotoğraf yükleyebilirsiniz. Üye olmanıza gerek yoktur.
            </div>
            <div class="short-link">${appUrl.replace(/^https?:\/\//, '')}/q/${selectedEvent.shortCode}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              // window.close();
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: Configuration & Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Selector */}
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

          {selectedEvent ? (
            <>
              {/* QR Designer Settings */}
              <div className="section-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings2 size={18} style={{ color: 'var(--primary)' }} />
                  <span>QR Tasarım Ayarları</span>
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Koyu Renk (Foreground)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        style={{ border: 'none', width: '40px', height: '40px', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
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
                    <label>Açık Renk (Background)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        disabled={transparentBg}
                        style={{ border: 'none', width: '40px', height: '40px', padding: 0, cursor: 'pointer', borderRadius: '4px', opacity: transparentBg ? 0.3 : 1 }}
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
                      <div style={{ fontWeight: 600 }}>Şeffaf Arka Plan</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>QR kodu şeffaf arka planla oluşturur.</div>
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
                      <option value="L">L (%7 Hata Düzeltme - Sade Grafik)</option>
                      <option value="M">M (%15 Hata Düzeltme)</option>
                      <option value="Q">Q (%25 Hata Düzeltme)</option>
                      <option value="H">H (%30 Hata Düzeltme - Logo Yerleşimi İçin)</option>
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
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px dashed var(--border-color)'
                    }}
                  >
                    <div 
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: 'var(--radius-sm)', 
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ImageIcon size={20} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ fontSize: '0.8rem' }}
                      />
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Küçük kare logolar en iyi sonucu verir.</p>
                    </div>
                    {logoPreview && (
                      <button type="button" onClick={clearLogo} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}>
                        Kaldır
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="section-card empty-state">
              <p>Etkinlik bulunamadı.</p>
            </div>
          )}

        </div>

        {/* Right: Preview & Analytics */}
        {selectedEvent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Visual Preview */}
            <div className="section-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}>
              <div 
                style={{ 
                  backgroundColor: transparentBg ? 'rgba(255,255,255,0.02)' : '#ffffff',
                  backgroundImage: transparentBg ? 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)' : 'none',
                  backgroundSize: transparentBg ? '10px 10px' : 'auto',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <canvas ref={canvasRef} style={{ width: '220px', height: '220px' }} />
              </div>

              <div style={{ marginTop: '20px', width: '100%' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Misafir Yönlendirme Bağlantısı</div>
                <div style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: '0.85rem', margin: '6px 0 20px', padding: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {redirectUrl}
                </div>

                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <button onClick={downloadPng} className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>
                    <Download size={16} />
                    <span>PNG İndir</span>
                  </button>
                  <button onClick={downloadSvg} className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>
                    <Download size={16} />
                    <span>SVG İndir</span>
                  </button>
                  <button onClick={printPdf} className="btn btn-secondary" style={{ padding: '10px 15px' }} title="Masa Kartı PDF Yazdır">
                    <Printer size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Scan Analytics */}
            {stats && (
              <div className="section-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} style={{ color: 'var(--success)' }} />
                  <span>Tarama İstatistikleri</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Users size={12} />
                      <span>Toplam Tarama</span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{stats.totalScans}</div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Users size={12} />
                      <span>Benzersiz Ziyaretçi</span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{stats.uniqueVisitors}</div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Percent size={12} />
                      <span>Yükleme Oranı</span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>%{stats.uploadRate}</div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Clock size={12} />
                      <span>En Yoğun Saat</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, padding: '4px 0' }}>{stats.peakHour}</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Smartphone size={14} />
                    <span>Cihaz Dağılımı</span>
                  </div>
                  {stats.devices.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Henüz tarama verisi yok.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {stats.devices.map((device, idx) => {
                        const pct = stats.totalScans > 0 ? (device.count / stats.totalScans) * 100 : 0;
                        return (
                          <div key={idx}>
                            <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>
                              <span>{device.type}</span>
                              <span style={{ fontWeight: 600 }}>{device.count} adet (%{pct.toFixed(0)})</span>
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
    </div>
  );
}
