import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { deleteFile } from '@/lib/storage';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();

    const { photoIds, action } = await req.json();

    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0 || !action) {
      return NextResponse.json({ error: 'Geçersiz parametreler.' }, { status: 400 });
    }

    // Load target photos
    const photos = await prisma.photo.findMany({
      where: { id: { in: photoIds } },
      include: { event: true },
    });

    if (photos.length === 0) {
      return NextResponse.json({ error: 'Fotoğraf bulunamadı.' }, { status: 404 });
    }

    const eventId = photos[0].eventId;

    // Apply Actions
    if (action === 'approve') {
      await prisma.photo.updateMany({
        where: { id: { in: photoIds } },
        data: { status: 'APPROVED' },
      });
    } 
    
    else if (action === 'reject') {
      await prisma.photo.updateMany({
        where: { id: { in: photoIds } },
        data: { status: 'REJECTED' },
      });
    } 
    
    else if (action === 'delete') {
      // Soft Delete: status = DELETED, deletedAt = now()
      await prisma.photo.updateMany({
        where: { id: { in: photoIds } },
        data: { 
          status: 'DELETED', 
          deletedAt: new Date() 
        },
      });
    } 
    
    else if (action === 'restore') {
      // Restore from soft delete
      await prisma.photo.updateMany({
        where: { id: { in: photoIds } },
        data: { 
          status: 'PENDING_APPROVAL', 
          deletedAt: null 
        },
      });
    } 
    
    else if (action === 'select_delivery') {
      // Add to delivery package (only approved photos)
      await prisma.photo.updateMany({
        where: { id: { in: photoIds }, status: 'APPROVED' },
        data: { isSelectedForDelivery: true },
      });
    } 
    
    else if (action === 'deselect_delivery') {
      // Remove from delivery package
      await prisma.photo.updateMany({
        where: { id: { in: photoIds } },
        data: { isSelectedForDelivery: false },
      });
    } 
    
    else if (action === 'delete_permanent') {
      // Physical file deletion and database purge
      const localDir = process.env.LOCAL_STORAGE_DIR || path.join(process.cwd(), 'storage');
      
      let totalFreedBytes = 0;
      let deletedCount = 0;

      for (const photo of photos) {
        // Calculate exact file sizes to decrement event storage
        let photoFreed = 0;
        if (process.env.STORAGE_PROVIDER !== 's3') {
          try {
            const pOrig = path.join(localDir, photo.originalUrl);
            const pGall = path.join(localDir, photo.galleryUrl);
            const pThumb = path.join(localDir, photo.thumbnailUrl);

            if (fs.existsSync(pOrig)) photoFreed += fs.statSync(pOrig).size;
            if (fs.existsSync(pGall)) photoFreed += fs.statSync(pGall).size;
            if (fs.existsSync(pThumb)) photoFreed += fs.statSync(pThumb).size;
          } catch (err) {
            photoFreed += photo.fileSize * 1.25; // fallback
          }
        } else {
          photoFreed += photo.fileSize * 1.25; // S3 estimate
        }

        totalFreedBytes += photoFreed;

        // Delete physical files
        try {
          await deleteFile(photo.originalUrl);
          await deleteFile(photo.galleryUrl);
          await deleteFile(photo.thumbnailUrl);
        } catch (err) {
          console.error(`Failed to delete files for photo: ${photo.id}`, err);
        }

        deletedCount++;
      }

      // Delete records from database
      await prisma.photo.deleteMany({
        where: { id: { in: photoIds } },
      });

      // Update event counters
      await prisma.event.update({
        where: { id: eventId },
        data: {
          currentPhotoCount: { decrement: deletedCount },
          currentStorageBytes: { decrement: BigInt(Math.round(totalFreedBytes)) },
        },
      });
    }

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: adminSession.userId,
        action: `MODERATE_${action.toUpperCase()}`,
        entityType: 'Photo',
        metadata: JSON.stringify({ count: photoIds.length, photoIds }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error moderating photos:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
