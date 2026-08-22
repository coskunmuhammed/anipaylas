import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const photos = await prisma.photo.findMany({
    include: { event: true },
  });

  const photoNullChecks = photos.map((p) => ({
    id: p.id,
    eventId: p.eventId,
    hasEvent: !!p.event,
    eventTitle: p.event?.title || null,
    hasOriginalUrl: !!p.originalUrl,
    hasGalleryUrl: !!p.galleryUrl,
    hasThumbnailUrl: !!p.thumbnailUrl,
    status: p.status,
  }));

  return NextResponse.json({
    totalPhotos: photos.length,
    photoNullChecks,
  });
}
