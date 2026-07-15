import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import PhotoModerator from './PhotoModerator';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    eventId?: string;
    status?: string;
    search?: string;
    sortBy?: string;
  }>;
}

export default async function AdminPhotosPage({ searchParams }: PageProps) {
  await requireAdmin();
  const resolvedParams = await searchParams;
  const eventId = resolvedParams.eventId;
  const status = resolvedParams.status || 'PENDING_APPROVAL';
  const search = resolvedParams.search || '';
  const sortBy = resolvedParams.sortBy || 'newest';

  // Get active events for filtering dropdown
  const events = await prisma.event.findMany({
    where: { status: { not: 'DELETED' } },
    orderBy: { eventDate: 'desc' },
  });

  // Build Prisma query filter
  const whereClause: any = {};

  if (eventId) {
    whereClause.eventId = eventId;
  }

  if (status === 'DELETED') {
    whereClause.deletedAt = { not: null };
  } else {
    whereClause.status = status;
    whereClause.deletedAt = null;
  }

  if (search) {
    whereClause.guestName = {
      contains: search,
      mode: 'insensitive',
    };
  }

  // Sorting
  let orderBy: any = { uploadedAt: 'desc' };
  if (sortBy === 'oldest') {
    orderBy = { uploadedAt: 'asc' };
  } else if (sortBy === 'largest') {
    orderBy = { fileSize: 'desc' };
  } else if (sortBy === 'smallest') {
    orderBy = { fileSize: 'asc' };
  }

  const photos = await prisma.photo.findMany({
    where: whereClause,
    orderBy,
    include: { event: true },
  });

  // Map storage keys to secure temporary signed URLs
  const secret = process.env.JWT_SECRET || 'local_storage_secret';
  const signedPhotos = photos.map((photo: any) => {
    const expires = Math.floor(Date.now() / 1000) + 7200; // 2 hours
    
    // Original signed URL
    const origSig = crypto
      .createHmac('sha256', secret)
      .update(`${photo.originalUrl}:${expires}`)
      .digest('hex');
    const signedOriginalUrl = `/api/storage/download?key=${encodeURIComponent(photo.originalUrl)}&expires=${expires}&signature=${origSig}`;

    // Gallery signed URL
    const gallSig = crypto
      .createHmac('sha256', secret)
      .update(`${photo.galleryUrl}:${expires}`)
      .digest('hex');
    const signedGalleryUrl = `/api/storage/download?key=${encodeURIComponent(photo.galleryUrl)}&expires=${expires}&signature=${gallSig}`;

    // Thumbnail signed URL
    const thumbSig = crypto
      .createHmac('sha256', secret)
      .update(`${photo.thumbnailUrl}:${expires}`)
      .digest('hex');
    const signedThumbnailUrl = `/api/storage/download?key=${encodeURIComponent(photo.thumbnailUrl)}&expires=${expires}&signature=${thumbSig}`;

    return {
      id: photo.id,
      eventId: photo.eventId,
      guestName: photo.guestName,
      guestMessage: photo.guestMessage,
      originalFilename: photo.originalFilename,
      storageKey: photo.storageKey,
      mimeType: photo.mimeType,
      fileSize: photo.fileSize,
      width: photo.width,
      height: photo.height,
      status: photo.status,
      isSelectedForDelivery: photo.isSelectedForDelivery,
      uploadedAt: photo.uploadedAt.toISOString(),
      deletedAt: photo.deletedAt ? photo.deletedAt.toISOString() : null,
      eventTitle: photo.event.title,
      signedOriginalUrl,
      signedGalleryUrl,
      signedThumbnailUrl,
    };
  });

  return (
    <PhotoModerator 
      initialPhotos={signedPhotos}
      events={events.map((e: any) => ({ id: e.id, title: e.title }))}
      currentEventId={eventId || ''}
      currentStatus={status}
      currentSearch={search}
      currentSortBy={sortBy}
    />
  );
}
