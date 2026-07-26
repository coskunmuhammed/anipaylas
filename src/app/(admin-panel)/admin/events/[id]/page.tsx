import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { getSignedDownloadUrl } from '@/lib/storage';
import EditEventForm from './EditEventForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  let signedCoverImageUrl: string | null = null;
  if (event.coverImageUrl) {
    signedCoverImageUrl = event.coverImageUrl.startsWith('http')
      ? event.coverImageUrl
      : await getSignedDownloadUrl(event.coverImageUrl);
  }

  // Format the event data for the client form (JSON serializable)
  const serializedEvent = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    shortCode: event.shortCode,
    eventType: event.eventType,
    subjectType: event.subjectType,
    brideName: event.brideName || '',
    groomName: event.groomName || '',
    hostName: event.hostName || '',
    instagramUsername: event.instagramUsername || '',
    eventDate: event.eventDate.toISOString().split('T')[0],
    startTime: event.startTime,
    endTime: event.endTime,
    venueName: event.venueName,
    city: event.city,
    district: event.district,
    welcomeTitle: event.welcomeTitle,
    welcomeMessage: event.welcomeMessage,
    coverImageUrl: signedCoverImageUrl,
    theme: event.theme,
    status: event.status,
    uploadStartsAt: event.uploadStartsAt.toISOString().slice(0, 16),
    uploadEndsAt: event.uploadEndsAt.toISOString().slice(0, 16),
    moderationEnabled: event.moderationEnabled,
    guestNameRequired: event.guestNameRequired,
    guestMessageEnabled: event.guestMessageEnabled,
    maxPhotosPerGuest: event.maxPhotosPerGuest,
    maxPhotoSizeBytes: event.maxPhotoSizeBytes,
    maxTotalPhotos: event.maxTotalPhotos,
    maxStorageBytes: Number(event.maxStorageBytes),
    currentPhotoCount: event.currentPhotoCount,
    currentStorageBytes: Number(event.currentStorageBytes),
  };

  return <EditEventForm event={serializedEvent} />;
}
