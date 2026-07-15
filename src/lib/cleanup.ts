import { prisma } from './prisma';
import { deleteFile } from './storage';
import fs from 'fs';
import path from 'path';

export async function runSystemCleanup() {
  const now = new Date();
  const reports: string[] = [];

  try {
    // 1. Deactivate expired download links
    const expiredLinks = await prisma.downloadLink.updateMany({
      where: {
        isActive: true,
        expiresAt: { lt: now },
      },
      data: {
        isActive: false,
      },
    });
    reports.push(`Süresi dolan ${expiredLinks.count} adet indirme bağlantısı kapatıldı.`);

    // 2. Permanently delete soft-deleted photos older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const oldDeletedPhotos = await prisma.photo.findMany({
      where: {
        status: 'DELETED',
        deletedAt: { lte: sevenDaysAgo },
      },
      include: { event: true },
    });

    if (oldDeletedPhotos.length > 0) {
      const localDir = process.env.LOCAL_STORAGE_DIR || path.join(process.cwd(), 'storage');
      const eventDecrements: Record<string, { count: number; bytes: number }> = {};

      for (const photo of oldDeletedPhotos) {
        let freedBytes = 0;
        
        if (process.env.STORAGE_PROVIDER !== 's3') {
          try {
            const pOrig = path.join(localDir, photo.originalUrl);
            const pGall = path.join(localDir, photo.galleryUrl);
            const pThumb = path.join(localDir, photo.thumbnailUrl);

            if (fs.existsSync(pOrig)) freedBytes += fs.statSync(pOrig).size;
            if (fs.existsSync(pGall)) freedBytes += fs.statSync(pGall).size;
            if (fs.existsSync(pThumb)) freedBytes += fs.statSync(pThumb).size;
          } catch {
            freedBytes += photo.fileSize * 1.25;
          }
        } else {
          freedBytes += photo.fileSize * 1.25;
        }

        // Delete actual files
        try {
          await deleteFile(photo.originalUrl);
          await deleteFile(photo.galleryUrl);
          await deleteFile(photo.thumbnailUrl);
        } catch (err) {
          console.error(`Failed to delete files for old photo ${photo.id}:`, err);
        }

        if (!eventDecrements[photo.eventId]) {
          eventDecrements[photo.eventId] = { count: 0, bytes: 0 };
        }
        eventDecrements[photo.eventId].count += 1;
        eventDecrements[photo.eventId].bytes += freedBytes;
      }

      // Delete photo rows from database
      const deleteIds = oldDeletedPhotos.map((p: any) => p.id);
      await prisma.photo.deleteMany({
        where: { id: { in: deleteIds } },
      });

      // Decrement event storage and counts
      for (const [eventId, dec] of Object.entries(eventDecrements)) {
        await prisma.event.update({
          where: { id: eventId },
          data: {
            currentPhotoCount: { decrement: dec.count },
            currentStorageBytes: { decrement: BigInt(Math.round(dec.bytes)) },
          },
        });
      }

      reports.push(`Çöp kutusunda 7 günden fazla bekleyen ${oldDeletedPhotos.length} adet fotoğraf kalıcı olarak silindi.`);
    }

    // 3. Delete expired Delivery Package ZIP files older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldPackages = await prisma.deliveryPackage.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { lte: thirtyDaysAgo },
        deletedAt: null,
      },
    });

    if (oldPackages.length > 0) {
      let count = 0;
      for (const pkg of oldPackages) {
        if (pkg.archiveStorageKey) {
          try {
            await deleteFile(pkg.archiveStorageKey);
            await prisma.deliveryPackage.update({
              where: { id: pkg.id },
              data: { deletedAt: new Date() },
            });
            count++;
          } catch (err) {
            console.error(`Failed to delete old ZIP package ${pkg.id}:`, err);
          }
        }
      }
      reports.push(`30 günden eski ${count} adet albüm ZIP teslim paketi depolama alanından silindi.`);
    }

    console.log('System cleanup completed successfully:', reports.join(' | '));
    return { success: true, reports };

  } catch (error: any) {
    console.error('System cleanup error:', error);
    return { success: false, error: error.message };
  }
}
