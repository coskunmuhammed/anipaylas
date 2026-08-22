import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const results: Record<string, any> = {};

  // 1. Test Dashboard (/admin) queries
  try {
    const recentPhotosRaw = await prisma.photo.findMany({
      take: 5,
      orderBy: { uploadedAt: 'desc' },
      where: { status: { not: 'DELETED' } },
      include: { event: true },
    });

    const { getSignedDownloadUrl } = await import('@/lib/storage');
    const recentPhotos = await Promise.all(
      recentPhotosRaw.map(async (photo: any) => {
        const signedThumbnailUrl = photo.thumbnailUrl?.startsWith('http')
          ? photo.thumbnailUrl
          : photo.thumbnailUrl ? await getSignedDownloadUrl(photo.thumbnailUrl) : '';
        return {
          ...photo,
          signedThumbnailUrl,
        };
      })
    );
    results.dashboardPhotosStatus = 'Success';
  } catch (err: any) {
    results.dashboardPhotosError = { message: err.message, stack: err.stack };
  }

  // 2. Test AdminPhotosPage (/admin/photos) queries
  try {
    const crypto = await import('crypto');
    const photos = await prisma.photo.findMany({
      where: { status: 'PENDING_APPROVAL', deletedAt: null },
      orderBy: { uploadedAt: 'desc' },
      include: { event: true },
    });

    const secret = process.env.JWT_SECRET || 'local_storage_secret';
    const signedPhotos = photos.map((photo: any) => {
      const expires = Math.floor(Date.now() / 1000) + 7200;
      
      const origSig = crypto
        .createHmac('sha256', secret)
        .update(`${photo.originalUrl}:${expires}`)
        .digest('hex');
      const signedOriginalUrl = `/api/storage/download?key=${encodeURIComponent(photo.originalUrl)}&expires=${expires}&signature=${origSig}`;

      const gallSig = crypto
        .createHmac('sha256', secret)
        .update(`${photo.galleryUrl}:${expires}`)
        .digest('hex');
      const signedGalleryUrl = `/api/storage/download?key=${encodeURIComponent(photo.galleryUrl)}&expires=${expires}&signature=${gallSig}`;

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
        eventTitle: photo.event?.title || 'Bilinmeyen',
        signedOriginalUrl,
        signedGalleryUrl,
        signedThumbnailUrl,
      };
    });
    results.photosPageStatus = 'Success';
    results.photosSampleCount = signedPhotos.length;
  } catch (err: any) {
    results.photosPageError = { message: err.message, stack: err.stack };
  }

  return NextResponse.json(results);
}
