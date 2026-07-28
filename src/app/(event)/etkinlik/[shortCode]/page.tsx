import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { getEventDisplayName } from '@/lib/eventUtils';
import { getSignedDownloadUrl } from '@/lib/storage';
import Link from 'next/link';
import InstagramIcon from '@/components/icons/InstagramIcon';
import GoldButton from '@/components/palm/GoldButton';
import { 
  Camera, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  AlertCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export default async function EventLandingPage({ params }: PageProps) {
  const { shortCode } = await params;

  const event = await prisma.event.findUnique({
    where: { shortCode },
  });

  if (!event || event.status === 'DELETED') {
    notFound();
  }

  // Calculate backend upload availability state
  const now = new Date();
  let uploadState: 'active' | 'not_started' | 'ended' | 'limit_reached' = 'active';
  let statusMessage = '';

  if (event.status === 'DRAFT') {
    uploadState = 'ended';
    statusMessage = 'Bu etkinlik henüz hazırlık aşamasında ve fotoğraf yüklemelerine kapalıdır.';
  } else if (event.status === 'ARCHIVED' || event.status === 'CLOSED_FOR_UPLOAD') {
    uploadState = 'ended';
    statusMessage = 'Bu etkinlik için fotoğraf yükleme süresi tamamlanmıştır.';
  } else if (now < event.uploadStartsAt) {
    uploadState = 'not_started';
    statusMessage = `Fotoğraf yüklemeleri henüz başlamamıştır. (Başlangıç: ${new Date(event.uploadStartsAt).toLocaleString('tr-TR')})`;
  } else if (now > event.uploadEndsAt) {
    uploadState = 'ended';
    statusMessage = 'Fotoğraf yükleme zaman aralığı sona ermiştir.';
  } else if (event.currentPhotoCount >= event.maxTotalPhotos || event.currentStorageBytes >= event.maxStorageBytes) {
    uploadState = 'limit_reached';
    statusMessage = 'Bu etkinlik için toplam fotoğraf ve depolama kotasına ulaşılmıştır.';
  }

  // Cover image URL resolution
  let signedCoverImageUrl: string | null = null;
  if (event.coverImageUrl) {
    signedCoverImageUrl = event.coverImageUrl.startsWith('http') 
      ? event.coverImageUrl 
      : await getSignedDownloadUrl(event.coverImageUrl);
  }

  const displayName = getEventDisplayName(event);
  const uploadPageUrl = `/etkinlik/${shortCode}/fotograf-yukle`;

  // Dynamic welcome message fallback based on eventType
  let dynamicIntro = event.welcomeMessage;
  if (!dynamicIntro) {
    if (event.eventType === 'WEDDING' || event.eventType === 'ENGAGEMENT' || event.eventType === 'HENNA') {
      dynamicIntro = 'Bu güzel gecenin bir parçası olduğunuz için mutluyuz. Çektiğiniz güzel anları bizimle paylaşın.';
    } else if (event.eventType === 'BIRTHDAY' || event.eventType === 'PARTY') {
      dynamicIntro = 'Bu eğlenceli günden yakaladığınız güzel kareleri bizimle paylaşın.';
    } else {
      dynamicIntro = 'Etkinlik boyunca çektiğiniz fotoğrafları dijital etkinlik albümüne ekleyebilirsiniz.';
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--palm-black)', color: 'var(--palm-cream)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Branding */}
      <header style={{ padding: '20px 24px', backgroundColor: 'var(--palm-deep-brown)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.12em', color: '#ffffff' }}>
            PALM
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 300, letterSpacing: '0.12em', color: '#ffffff' }}>
            STUDIO®
          </span>
        </Link>
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--palm-gold)', fontWeight: 700 }}>
          DİJİTAL ANI ALBÜMÜ
        </span>
      </header>

      {/* Main Landing Area */}
      <main style={{ flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto', padding: '40px 20px 60px 20px' }}>
        
        {/* Cover Image & Event Card */}
        <div className="palm-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--palm-surface)', marginBottom: '28px' }}>
          {signedCoverImageUrl && (
            <div style={{ height: '280px', width: '100%', position: 'relative' }}>
              <img src={signedCoverImageUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26, 20, 15, 0.95) 0%, transparent 60%)' }} />
            </div>
          )}

          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'rgba(201, 170, 103, 0.12)', color: 'var(--palm-gold-light)', border: '1px solid rgba(201, 170, 103, 0.25)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
              {event.eventType || 'ETKİNLİK'}
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 600, color: '#ffffff', marginBottom: '16px', lineHeight: 1.15 }}>
              {displayName}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', color: 'var(--palm-gold-light)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '28px' }}>
              {event.eventDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} />
                  <span>{new Date(event.eventDate).toLocaleDateString('tr-TR')}</span>
                </div>
              )}
              {event.venueName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} />
                  <span>{event.venueName} ({event.city})</span>
                </div>
              )}
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--palm-muted)', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 36px auto' }}>
              {dynamicIntro}
            </p>

            {/* Upload Button State Handling */}
            {uploadState === 'active' ? (
              <GoldButton href={uploadPageUrl} fullWidth style={{ padding: '18px 32px', fontSize: '1.1rem' }}>
                <Camera size={22} />
                <span>Fotoğraf Paylaş</span>
              </GoldButton>
            ) : (
              <div style={{ padding: '18px 24px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', color: '#fca5a5', fontSize: '0.95rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Palm Stüdyo Brand Experience Card */}
        <div className="palm-card" style={{ backgroundColor: '#1f1813', textAlign: 'center', marginBottom: '28px', border: '1px solid rgba(201, 170, 103, 0.2)' }}>
          <Sparkles size={32} style={{ color: 'var(--palm-gold)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
            Palm Stüdyo Dijital Anı Albümü
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--palm-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
            Çektiğiniz her kare, bu özel gecenin yıllar boyunca saklanacak değerli bir hatırası olarak dijital albüme eklenir.
          </p>
          <Link href="/" style={{ color: 'var(--palm-gold-light)', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>Palm Stüdyo'yu Keşfet</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Event Owner Instagram */}
        {event.instagramUsername && (
          <div className="palm-card" style={{ backgroundColor: 'var(--palm-surface)', textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--palm-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
              ETKİNLİK SAHİBİ INSTAGRAM HESABI
            </div>
            <a
              href={`https://instagram.com/${event.instagramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}
            >
              <InstagramIcon size={20} style={{ color: '#E1306C' }} />
              <span>@{event.instagramUsername}</span>
            </a>
          </div>
        )}

      </main>

      {/* Brand Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--palm-muted)', backgroundColor: 'var(--palm-deep-brown)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        Bu dijital anı deneyimi <Link href="/" style={{ color: 'var(--palm-gold-light)', fontWeight: 700 }}>Palm Stüdyo</Link> tarafından hazırlanmıştır.
      </footer>
    </div>
  );
}
