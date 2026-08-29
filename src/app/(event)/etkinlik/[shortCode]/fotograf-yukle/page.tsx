import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getSignedDownloadUrl } from '@/lib/storage';
import { getEventWindow } from '@/lib/eventUtils';
import GuestUploadPortal from '@/components/upload/GuestUploadPortal';
import '@/app/guest.css';

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

export default async function EventUploadPage({ params }: PageProps) {
  const { shortCode } = await params;

  const event = await prisma.event.findUnique({
    where: { shortCode },
  });

  if (!event || event.status === 'DELETED') {
    notFound();
  }

  // Server-side active window and limit validation using canonical getEventWindow
  const now = new Date();
  const window = getEventWindow(event, now);

  let statusMessage = '';
  let isBlocked = false;

  if (event.status === 'DRAFT') {
    statusMessage = 'Bu etkinlik henüz taslak aşamasındadır ve fotoğraf yüklemelerine kapalıdır.';
    isBlocked = true;
  } else if (event.status === 'ARCHIVED') {
    statusMessage = 'Bu etkinlik arşivlenmiştir. Fotoğraf yüklemeleri sona ermiştir.';
    isBlocked = true;
  } else if (!window.hasStarted) {
    statusMessage = `Fotoğraf yüklemeleri henüz başlamamıştır. (Başlangıç: ${window.startsAtFormatted})`;
    isBlocked = true;
  } else if (window.hasEnded || event.status === 'CLOSED_FOR_UPLOAD') {
    statusMessage = 'Bu etkinlik için fotoğraf yükleme süresi dolmuştur. İlginiz için teşekkür ederiz.';
    isBlocked = true;
  } else if (event.currentPhotoCount >= event.maxTotalPhotos || event.currentStorageBytes >= event.maxStorageBytes) {
    statusMessage = 'Bu etkinlik için maksimum fotoğraf ve depolama sınırına ulaşılmıştır.';
    isBlocked = true;
  }

  let signedCoverImageUrl: string | null = null;
  if (event.coverImageUrl) {
    signedCoverImageUrl = event.coverImageUrl.startsWith('http') 
      ? event.coverImageUrl 
      : await getSignedDownloadUrl(event.coverImageUrl);
  }

  // Serialize safe public event data
  const serializedEvent = {
    id: event.id,
    shortCode: event.shortCode,
    title: event.title,
    eventType: event.eventType,
    subjectType: event.subjectType,
    brideName: event.brideName,
    groomName: event.groomName,
    hostName: event.hostName,
    instagramUsername: event.instagramUsername,
    eventDate: event.eventDate ? new Date(event.eventDate).toLocaleDateString('tr-TR') : '',
    welcomeTitle: event.welcomeTitle,
    welcomeMessage: event.welcomeMessage,
    coverImageUrl: signedCoverImageUrl,
    theme: event.theme,
    guestNameRequired: event.guestNameRequired,
    guestMessageEnabled: event.guestMessageEnabled,
    maxPhotosPerGuest: event.maxPhotosPerGuest,
    maxPhotoSizeBytes: event.maxPhotoSizeBytes,
    locationVerificationEnabled: event.locationVerificationEnabled,
    geofenceRadiusMeters: event.geofenceRadiusMeters,
  };

  return (
    <GuestUploadPortal 
      event={serializedEvent} 
      isBlocked={isBlocked} 
      statusMessage={statusMessage} 
    />
  );
}
