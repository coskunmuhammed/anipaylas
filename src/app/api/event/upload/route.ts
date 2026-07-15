import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processImage } from '@/lib/image';
import { saveFile } from '@/lib/storage';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File | null;
    const sessionToken = formData.get('sessionToken') as string | null;
    const guestMessage = formData.get('guestMessage') as string | null;

    if (!file || !sessionToken) {
      return NextResponse.json({ error: 'Eksik dosya veya oturum parametresi.' }, { status: 400 });
    }

    // 1. Validate session
    const session = await prisma.uploadSession.findUnique({
      where: { sessionToken },
      include: { event: true },
    });

    if (!session || session.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Geçersiz yükleme oturumu.' }, { status: 401 });
    }

    if (new Date() > session.expiresAt) {
      return NextResponse.json({ error: 'Yükleme oturumu süresi dolmuştur.' }, { status: 401 });
    }

    const event = session.event;
    if (event.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Etkinlik şu anda aktif değil veya fotoğraf yüklemeye kapalı.' }, { status: 403 });
    }

    // 2. Validate limits
    // Max photos per guest
    if (session.uploadedPhotoCount >= event.maxPhotosPerGuest) {
      return NextResponse.json({ error: `Misafir başına maksimum fotoğraf sınırı (${event.maxPhotosPerGuest}) dolmuştur.` }, { status: 400 });
    }

    // Max photos total for this event
    if (event.currentPhotoCount >= event.maxTotalPhotos) {
      return NextResponse.json({ error: 'Bu etkinlik için toplam fotoğraf sınırına ulaşılmıştır.' }, { status: 400 });
    }

    // Max storage total for this event
    if (event.currentStorageBytes >= event.maxStorageBytes) {
      return NextResponse.json({ error: 'Bu etkinlik için depolama alanı dolmuştur.' }, { status: 400 });
    }

    // Validate size of individual file
    if (file.size > event.maxPhotoSizeBytes) {
      return NextResponse.json({ error: `Fotoğraf boyutu maksimum sınırı (${event.maxPhotoSizeBytes / 1024 / 1024}MB) aşmaktadır.` }, { status: 400 });
    }

    // Strict format validation
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isHeic = fileExt === 'heic' || fileExt === 'heif';
    if (!allowedMimeTypes.includes(file.type) && !isHeic) {
      return NextResponse.json({ error: 'Yalnızca fotoğraf dosyaları yüklenebilir. Videolar kabul edilmez.' }, { status: 400 });
    }

    // 3. Read array buffer and process image
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let processed;
    try {
      processed = await processImage(inputBuffer, file.name, file.type);
    } catch (imageErr: any) {
      console.error('Image processing failed:', imageErr);
      return NextResponse.json({ error: imageErr.message || 'Görsel işlenemedi. Dosya bozuk olabilir.' }, { status: 400 });
    }

    const {
      originalBuffer,
      originalMime,
      originalExt,
      galleryBuffer,
      thumbnailBuffer,
      width,
      height
    } = processed;

    // 4. Generate keys and save to storage
    const photoId = crypto.randomUUID();
    const basePath = `events/${event.id}/photos/${photoId}`;
    const originalKey = `${basePath}_original.${originalExt}`;
    const galleryKey = `${basePath}_gallery.webp`;
    const thumbnailKey = `${basePath}_thumb.webp`;

    await saveFile(originalBuffer, originalKey, originalMime);
    await saveFile(galleryBuffer, galleryKey, 'image/webp');
    await saveFile(thumbnailBuffer, thumbnailKey, 'image/webp');

    // Calculate sizes
    const totalAddedStorage = originalBuffer.length + galleryBuffer.length + thumbnailBuffer.length;

    // 5. Save photo to database
    // Default photo status depends on moderation setting
    const status = event.moderationEnabled ? 'PENDING_APPROVAL' : 'APPROVED';

    const photo = await prisma.photo.create({
      data: {
        id: photoId,
        eventId: event.id,
        guestName: session.guestName || 'Anonim Misafir',
        guestMessage: guestMessage || null,
        originalUrl: originalKey,
        galleryUrl: galleryKey,
        thumbnailUrl: thumbnailKey,
        originalFilename: file.name,
        storageKey: originalKey,
        mimeType: originalMime,
        fileSize: originalBuffer.length, // store original size
        width,
        height,
        status,
      },
    });

    // Update upload session stats
    await prisma.uploadSession.update({
      where: { id: session.id },
      data: {
        uploadedPhotoCount: { increment: 1 },
        uploadedBytes: { increment: originalBuffer.length },
      },
    });

    // Update event stats
    await prisma.event.update({
      where: { id: event.id },
      data: {
        currentPhotoCount: { increment: 1 },
        currentStorageBytes: { increment: totalAddedStorage },
      },
    });

    return NextResponse.json({ success: true, photoId: photo.id });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Yükleme sırasında sunucu hatası oluştu.' }, { status: 500 });
  }
}
