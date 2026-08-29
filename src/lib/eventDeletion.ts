import { prisma } from './prisma';
import { STORAGE_ROOT } from '@/lib/storage/config';
import fs from 'fs';
import path from 'path';

/**
 * Ensures that a given file or directory path stays strictly inside STORAGE_ROOT.
 * Prevents directory traversal attacks (e.g. '../', malformed storage keys).
 */
export function isPathInsideStorage(targetPath: string): boolean {
  if (!targetPath) return false;
  const normalizedRoot = path.resolve(STORAGE_ROOT);
  const normalizedTarget = path.resolve(targetPath);
  return (
    normalizedTarget.startsWith(normalizedRoot + path.sep) ||
    normalizedTarget === normalizedRoot
  );
}

/**
 * Resolves a storage key or URL relative path to an absolute filesystem path inside STORAGE_ROOT.
 */
export function resolveStoragePath(storageKeyOrPath: string): string | null {
  if (!storageKeyOrPath) return null;

  // If path is an absolute path, verify if it stays inside STORAGE_ROOT
  if (path.isAbsolute(storageKeyOrPath)) {
    const normalized = path.resolve(storageKeyOrPath);
    if (!isPathInsideStorage(normalized)) {
      console.warn(`SECURITY ALERT: Attempted path traversal blocked: ${storageKeyOrPath} -> ${normalized}`);
      return null;
    }
    return normalized;
  }

  // Clean leading slashes, media prefix, or dots
  const cleanKey = storageKeyOrPath.replace(/^\/media\//, '').replace(/^[/\\]+/, '');
  const absolutePath = path.resolve(STORAGE_ROOT, cleanKey);

  if (!isPathInsideStorage(absolutePath)) {
    console.warn(`SECURITY ALERT: Attempted path traversal blocked: ${storageKeyOrPath} -> ${absolutePath}`);
    return null;
  }

  return absolutePath;
}

/**
 * Safely removes a single file if it exists and resides inside STORAGE_ROOT.
 */
async function safeUnlinkFile(filePath: string): Promise<boolean> {
  if (!filePath || !isPathInsideStorage(filePath)) return false;
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (err) {
    console.error(`Failed to unlink file at ${filePath}:`, err);
  }
  return false;
}

/**
 * Safely removes a directory recursively if it exists and resides inside STORAGE_ROOT.
 */
async function safeRemoveDir(dirPath: string): Promise<boolean> {
  if (!dirPath || !isPathInsideStorage(dirPath)) return false;
  // Guard against accidentally removing STORAGE_ROOT itself
  if (path.resolve(dirPath) === path.resolve(STORAGE_ROOT)) return false;
  
  try {
    if (fs.existsSync(dirPath)) {
      await fs.promises.rm(dirPath, { recursive: true, force: true });
      return true;
    }
  } catch (err) {
    console.error(`Failed to remove directory at ${dirPath}:`, err);
  }
  return false;
}

export interface DeletionResult {
  success: boolean;
  message: string;
  deletedPhotosCount?: number;
  freedBytes?: number;
  error?: string;
}

/**
 * OPERATION A: Complete Event Deletion
 * Permanently removes an Event and ALL related relational DB data and physical storage files.
 */
export async function deleteEventCompletely(
  eventId: string,
  adminUserId?: string
): Promise<DeletionResult> {
  try {
    if (!eventId) {
      return { success: false, message: 'Etkinlik ID bilgisi eksik.' };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return { success: false, message: 'Silinecek etkinlik bulunamadı.' };
    }

    // 1. Collect all photo storage keys
    const photos = await prisma.photo.findMany({
      where: { eventId },
      select: {
        id: true,
        originalUrl: true,
        galleryUrl: true,
        thumbnailUrl: true,
        storageKey: true,
        fileSize: true,
      },
    });

    // 2. Collect all delivery package archive keys
    const deliveryPackages = await prisma.deliveryPackage.findMany({
      where: { eventId },
      select: { id: true, archiveStorageKey: true },
    });

    // 3. Collect physical files & directory paths
    const filesToDelete = new Set<string>();

    for (const photo of photos) {
      const origPath = resolveStoragePath(photo.originalUrl || photo.storageKey);
      if (origPath) filesToDelete.add(origPath);

      const gallPath = resolveStoragePath(photo.galleryUrl);
      if (gallPath) filesToDelete.add(gallPath);

      const thumbPath = resolveStoragePath(photo.thumbnailUrl);
      if (thumbPath) filesToDelete.add(thumbPath);
    }

    for (const pkg of deliveryPackages) {
      if (pkg.archiveStorageKey) {
        const pkgPath = resolveStoragePath(pkg.archiveStorageKey);
        if (pkgPath) filesToDelete.add(pkgPath);
      }
    }

    if (event.coverImageUrl && !event.coverImageUrl.startsWith('http')) {
      const coverPath = resolveStoragePath(event.coverImageUrl);
      if (coverPath) filesToDelete.add(coverPath);
    }

    const eventPhotosDir = path.resolve(STORAGE_ROOT, 'events', eventId);
    const eventDeliveriesDir = path.resolve(STORAGE_ROOT, 'deliveries', eventId);

    // 4. Perform database deletion in a transaction
    await prisma.$transaction(async (tx) => {
      // Consent logs
      await tx.consentLog.deleteMany({
        where: { eventId },
      });

      // Download logs
      await tx.downloadLog.deleteMany({
        where: {
          downloadLink: { eventId },
        },
      });

      // Download links
      await tx.downloadLink.deleteMany({
        where: { eventId },
      });

      // Delivery packages
      await tx.deliveryPackage.deleteMany({
        where: { eventId },
      });

      // QR Scans
      await tx.qrScan.deleteMany({
        where: { eventId },
      });

      // Upload sessions
      await tx.uploadSession.deleteMany({
        where: { eventId },
      });

      // Photos
      await tx.photo.deleteMany({
        where: { eventId },
      });

      // Event itself
      await tx.event.delete({
        where: { id: eventId },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          adminUserId: adminUserId || null,
          action: 'DELETE_EVENT_COMPLETELY',
          entityType: 'Event',
          entityId: eventId,
          metadata: JSON.stringify({
            eventTitle: event.title,
            shortCode: event.shortCode,
            deletedPhotosCount: photos.length,
            deletedPackagesCount: deliveryPackages.length,
          }),
        },
      });
    });

    // 5. Clean up physical storage files and directories after DB transaction succeeds
    for (const file of filesToDelete) {
      await safeUnlinkFile(file);
    }

    await safeRemoveDir(eventPhotosDir);
    await safeRemoveDir(eventDeliveriesDir);

    console.log(`Event ${eventId} (${event.title}) deleted completely.`);

    return {
      success: true,
      message: `"${event.title}" etkinliği ve bağlı tüm verileri başarıyla kalıcı olarak silindi.`,
      deletedPhotosCount: photos.length,
    };
  } catch (error: any) {
    console.error(`Error deleting event completely (${eventId}):`, error);
    return {
      success: false,
      message: 'Etkinlik silinirken sunucu hatası oluştu.',
      error: error.message,
    };
  }
}

/**
 * OPERATION B: Event Storage Cleanup
 * Deletes all physical photo/ZIP media files and photo DB records for an event,
 * resets storage counters to 0, but PRESERVES the Event record itself and its QR configuration.
 */
export async function clearEventStorage(
  eventId: string,
  adminUserId?: string
): Promise<DeletionResult> {
  try {
    if (!eventId) {
      return { success: false, message: 'Etkinlik ID bilgisi eksik.' };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return { success: false, message: 'Etkinlik bulunamadı.' };
    }

    // 1. Collect photos
    const photos = await prisma.photo.findMany({
      where: { eventId },
      select: {
        id: true,
        originalUrl: true,
        galleryUrl: true,
        thumbnailUrl: true,
        storageKey: true,
      },
    });

    // 2. Collect delivery packages
    const deliveryPackages = await prisma.deliveryPackage.findMany({
      where: { eventId },
      select: { id: true, archiveStorageKey: true },
    });

    // 3. Collect physical files & directory paths
    const filesToDelete = new Set<string>();

    for (const photo of photos) {
      const origPath = resolveStoragePath(photo.originalUrl || photo.storageKey);
      if (origPath) filesToDelete.add(origPath);

      const gallPath = resolveStoragePath(photo.galleryUrl);
      if (gallPath) filesToDelete.add(gallPath);

      const thumbPath = resolveStoragePath(photo.thumbnailUrl);
      if (thumbPath) filesToDelete.add(thumbPath);
    }

    for (const pkg of deliveryPackages) {
      if (pkg.archiveStorageKey) {
        const pkgPath = resolveStoragePath(pkg.archiveStorageKey);
        if (pkgPath) filesToDelete.add(pkgPath);
      }
    }

    const eventPhotosSubdir = path.resolve(STORAGE_ROOT, 'events', eventId, 'photos');
    const eventDeliveriesDir = path.resolve(STORAGE_ROOT, 'deliveries', eventId);

    // 4. Perform DB transaction (Delete Photos & ZIP Packages, Reset Event Counters)
    await prisma.$transaction(async (tx) => {
      // Delete DownloadLogs for this event
      await tx.downloadLog.deleteMany({
        where: { downloadLink: { eventId } },
      });

      // Delete DownloadLinks
      await tx.downloadLink.deleteMany({
        where: { eventId },
      });

      // Delete DeliveryPackages
      await tx.deliveryPackage.deleteMany({
        where: { eventId },
      });

      // Delete Photo records
      await tx.photo.deleteMany({
        where: { eventId },
      });

      // Reset event metrics to 0
      await tx.event.update({
        where: { id: eventId },
        data: {
          currentPhotoCount: 0,
          currentStorageBytes: BigInt(0),
        },
      });

      // Create AuditLog
      await tx.auditLog.create({
        data: {
          adminUserId: adminUserId || null,
          action: 'CLEAR_EVENT_STORAGE',
          entityType: 'Event',
          entityId: eventId,
          metadata: JSON.stringify({
            eventTitle: event.title,
            shortCode: event.shortCode,
            clearedPhotosCount: photos.length,
            clearedPackagesCount: deliveryPackages.length,
          }),
        },
      });
    });

    // 5. Clean up physical files from disk
    for (const file of filesToDelete) {
      await safeUnlinkFile(file);
    }

    await safeRemoveDir(eventPhotosSubdir);
    await safeRemoveDir(eventDeliveriesDir);

    console.log(`Event ${eventId} (${event.title}) storage cleared.`);

    return {
      success: true,
      message: `"${event.title}" etkinliğinin tüm fotoğrafları ve depolama alanı temizlendi. Etkinlik aktif kalmaya devam ediyor.`,
      deletedPhotosCount: photos.length,
    };
  } catch (error: any) {
    console.error(`Error clearing event storage (${eventId}):`, error);
    return {
      success: false,
      message: 'Etkinlik depolaması temizlenirken sunucu hatası oluştu.',
      error: error.message,
    };
  }
}
