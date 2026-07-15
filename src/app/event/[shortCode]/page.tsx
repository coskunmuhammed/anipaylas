import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getSignedDownloadUrl } from '@/lib/storage';
import GuestUploadPortal from './GuestUploadPortal';
import '@/app/event/guest.css';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export default async function GuestEventPage({ params }: PageProps) {
  const { shortCode } = await params;

  const event = await prisma.event.findUnique({
    where: { shortCode },
  });

  if (!event || event.status === 'DELETED') {
    notFound();
  }

  const now = new Date();
  let statusMessage = '';
  let isBlocked = false;

  if (event.status === 'DRAFT') {
    statusMessage = 'Bu etkinlik henüz taslak aşamasındadır ve fotoğraf yüklemelerine kapalıdır.';
    isBlocked = true;
  } else if (event.status === 'ARCHIVED') {
    statusMessage = 'Bu etkinlik arşivlenmiştir. Fotoğraf yüklemeleri sona ermiştir.';
    isBlocked = true;
  } else if (now < event.uploadStartsAt) {
    statusMessage = `Fotoğraf yüklemeleri henüz başlamamıştır. Başlangıç Tarihi: ${new Date(event.uploadStartsAt).toLocaleString('tr-TR')}`;
    isBlocked = true;
  } else if (now > event.uploadEndsAt || event.status === 'CLOSED_FOR_UPLOAD') {
    statusMessage = 'Bu etkinlik için fotoğraf yükleme süresi dolmuştur. İlginiz için teşekkür ederiz.';
    isBlocked = true;
  }

  let signedCoverImageUrl: string | null = null;
  if (event.coverImageUrl) {
    signedCoverImageUrl = event.coverImageUrl.startsWith('http') 
      ? event.coverImageUrl 
      : await getSignedDownloadUrl(event.coverImageUrl);
  }

  // Format data for client component
  const serializedEvent = {
    id: event.id,
    title: event.title,
    brideName: event.brideName,
    groomName: event.groomName,
    eventDate: event.eventDate.toLocaleDateString('tr-TR'),
    welcomeTitle: event.welcomeTitle,
    welcomeMessage: event.welcomeMessage,
    coverImageUrl: signedCoverImageUrl,
    theme: event.theme,
    guestNameRequired: event.guestNameRequired,
    guestMessageEnabled: event.guestMessageEnabled,
    maxPhotosPerGuest: event.maxPhotosPerGuest,
    maxPhotoSizeBytes: event.maxPhotoSizeBytes,
  };

  return (
    <GuestUploadPortal 
      event={serializedEvent} 
      isBlocked={isBlocked} 
      statusMessage={statusMessage} 
    />
  );
}
