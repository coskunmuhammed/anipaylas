import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { getEventDisplayName } from '@/lib/eventUtils';
import { getSignedDownloadUrl } from '@/lib/storage';
import { getEventUploadUrl } from '@/lib/urlUtils';
import Link from 'next/link';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { 
  Camera, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  AlertCircle,
  Clock,
  ShieldCheck,
  QrCode
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
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F6F1', color: '#1E2522', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Branding */}
      <header style={{ padding: '16px 24px', backgroundColor: '#183D35', color: '#F8F6F1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#B59A63', color: '#183D35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
            P
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.04em', color: '#F8F6F1' }}>
            PALM STÜDYO
          </span>
        </Link>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DCCDBD', fontWeight: 600 }}>
          DİJİTAL ANI ALBÜMÜ
        </span>
      </header>

      {/* Main Landing Area */}
      <main style={{ flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto', padding: '32px 20px 60px 20px' }}>
        
        {/* Cover Image & Event Card */}
        <div className="palm-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#ffffff', marginBottom: '28px' }}>
          {signedCoverImageUrl && (
            <div style={{ height: '260px', width: '100%', position: 'relative' }}>
              <img src={signedCoverImageUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(24, 61, 53, 0.8) 0%, transparent 60%)' }} />
            </div>
          )}

          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', backgroundColor: 'var(--palm-surface-light)', color: '#183D35', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
              {event.eventType || 'ETKİNLİK'}
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: '#183D35', marginBottom: '12px', lineHeight: 1.2 }}>
              {displayName}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', color: '#557A67', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} />
                <span>{event.eventDate ? new Date(event.eventDate).toLocaleDateString('tr-TR') : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} />
                <span>{event.venueName} ({event.city})</span>
              </div>
            </div>

            <p style={{ fontSize: '1.05rem', color: '#4a5568', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 32px auto' }}>
              {dynamicIntro}
            </p>

            {/* Upload Button State Handling */}
            {uploadState === 'active' ? (
              <Link href={uploadPageUrl} className="palm-btn-gold" style={{ width: '100%', maxWidth: '360px', padding: '16px 32px', fontSize: '1.1rem' }}>
                <Camera size={22} />
                <span>Fotoğraf Paylaş</span>
              </Link>
            ) : (
              <div style={{ padding: '16px 24px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', color: '#991b1b', fontSize: '0.95rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Palm Stüdyo Brand Experience Card */}
        <div className="palm-card" style={{ backgroundColor: '#183D35', color: '#F8F6F1', textAlign: 'center', marginBottom: '28px' }}>
          <Sparkles size={32} style={{ color: '#B59A63', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: '#F8F6F1', marginBottom: '8px' }}>
            Palm Stüdyo Dijital Anı Albümü
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#DCCDBD', lineHeight: '1.6', marginBottom: '20px' }}>
            Çektiğiniz her kare, bu özel gecenin yıllar boyunca saklanacak değerli bir hatırası olarak dijital albüme eklenir.
          </p>
          <Link href="/" style={{ color: '#B59A63', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>Palm Stüdyo'yu Keşfet</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Event Owner Instagram */}
        {event.instagramUsername && (
          <div className="palm-card" style={{ backgroundColor: '#ffffff', textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#557A67', textTransform: 'uppercase', marginBottom: '6px' }}>
              Etkinlik Sahibi Instagram Hesabı
            </div>
            <a
              href={`https://instagram.com/${event.instagramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 700, color: '#183D35' }}
            >
              <InstagramIcon size={20} style={{ color: '#E1306C' }} />
              <span>@{event.instagramUsername}</span>
            </a>
          </div>
        )}

      </main>

      {/* Brand Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', fontSize: '0.82rem', color: '#64748b', backgroundColor: '#F8F6F1' }}>
        Bu dijital anı deneyimi <Link href="/" style={{ color: '#183D35', fontWeight: 700 }}>Palm Stüdyo</Link> tarafından hazırlanmıştır.
      </footer>
    </div>
  );
}
