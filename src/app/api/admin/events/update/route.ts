import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { saveFile, deleteFile } from '@/lib/storage';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();

    const formData = await req.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const brideName = formData.get('brideName') as string;
    const groomName = formData.get('groomName') as string;
    const eventDateStr = formData.get('eventDate') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const venueName = formData.get('venueName') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;
    const welcomeTitle = formData.get('welcomeTitle') as string;
    const welcomeMessage = formData.get('welcomeMessage') as string;
    const theme = formData.get('theme') as string;
    const status = formData.get('status') as any;
    
    const moderationEnabled = formData.get('moderationEnabled') === 'true';
    const guestNameRequired = formData.get('guestNameRequired') === 'true';
    const guestMessageEnabled = formData.get('guestMessageEnabled') === 'true';
    
    const uploadStartsAtStr = formData.get('uploadStartsAt') as string;
    const uploadEndsAtStr = formData.get('uploadEndsAt') as string;
    
    const maxPhotosPerGuest = parseInt(formData.get('maxPhotosPerGuest') as string, 10);
    const maxPhotoSizeBytes = parseInt(formData.get('maxPhotoSizeBytes') as string, 10);
    const maxTotalPhotos = parseInt(formData.get('maxTotalPhotos') as string, 10);
    const maxStorageBytes = parseInt(formData.get('maxStorageBytes') as string, 10);

    const coverImageFile = formData.get('coverImage') as File | null;

    if (!id || !title || !brideName || !groomName || !eventDateStr || !venueName || !city || !district) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksiktir.' }, { status: 400 });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı.' }, { status: 404 });
    }

    // Process cover image replacement
    let coverImageUrl = existingEvent.coverImageUrl;
    if (coverImageFile && coverImageFile.size > 0) {
      // Delete old cover image if it exists
      if (existingEvent.coverImageUrl) {
        try {
          await deleteFile(existingEvent.coverImageUrl);
        } catch (err) {
          console.error('Failed to delete old cover image:', err);
        }
      }

      // Save new cover image
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      const ext = path.extname(coverImageFile.name) || '.jpg';
      const key = `covers/${existingEvent.slug}-${Date.now()}${ext}`;
      coverImageUrl = await saveFile(buffer, key, coverImageFile.type);
    }

    // Parse dates safely
    const eventDate = new Date(eventDateStr);
    const fallbackStart = !isNaN(eventDate.getTime()) ? eventDate : new Date();
    const fallbackEnd = new Date(fallbackStart.getTime() + 24 * 60 * 60 * 1000);

    const uploadStartsAt = uploadStartsAtStr && !isNaN(new Date(uploadStartsAtStr).getTime())
      ? new Date(uploadStartsAtStr)
      : fallbackStart;

    const uploadEndsAt = uploadEndsAtStr && !isNaN(new Date(uploadEndsAtStr).getTime())
      ? new Date(uploadEndsAtStr)
      : fallbackEnd;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        brideName,
        groomName,
        eventDate,
        startTime,
        endTime,
        venueName,
        city,
        district,
        welcomeTitle,
        welcomeMessage,
        theme,
        status,
        uploadStartsAt,
        uploadEndsAt,
        moderationEnabled,
        guestNameRequired,
        guestMessageEnabled,
        maxPhotosPerGuest,
        maxPhotoSizeBytes,
        maxTotalPhotos,
        maxStorageBytes,
        coverImageUrl,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: adminSession.userId,
        action: 'UPDATE_EVENT',
        entityType: 'Event',
        entityId: updatedEvent.id,
        metadata: JSON.stringify({ title, status }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
