import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { getDecryptedToken } from '@/services/downloadLink.service';
import { getEventDisplayName } from '@/lib/eventUtils';
import DownloadsList from './DownloadsList';

export const dynamic = 'force-dynamic';

export default async function AdminDownloadsPage() {
  await requireAdmin();

  const links = await prisma.downloadLink.findMany({
    where: { event: { status: { not: 'DELETED' } } },
    orderBy: { createdAt: 'desc' },
    include: {
      event: true,
      deliveryPackage: true,
    },
  });

  const serializedLinks = links.map((link) => {
    const rawToken = getDecryptedToken(link.tokenEncrypted);
    const needsRegeneration = !link.tokenEncrypted || !rawToken;

    return {
      id: link.id,
      eventId: link.eventId,
      eventTitle: link.event.title,
      displayName: getEventDisplayName(link.event),
      packageId: link.deliveryPackageId,
      photoCount: link.deliveryPackage.photoCount,
      packageSize: Number(link.deliveryPackage.archiveSizeBytes || 0),
      isActive: link.isActive,
      expiresAt: link.expiresAt.toISOString(),
      maxDownloadCount: link.maxDownloadCount,
      currentDownloadCount: link.currentDownloadCount,
      lastDownloadedAt: link.lastDownloadedAt ? link.lastDownloadedAt.toISOString() : null,
      createdAt: link.createdAt.toISOString(),
      revokedAt: link.revokedAt ? link.revokedAt.toISOString() : null,
      rawToken: rawToken || null,
      needsRegeneration,
    };
  });

  return <DownloadsList links={serializedLinks} />;
}
