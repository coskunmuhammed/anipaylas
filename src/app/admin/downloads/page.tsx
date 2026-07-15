import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
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

  const serializedLinks = links.map((link: any) => ({
    id: link.id,
    eventId: link.eventId,
    eventTitle: link.event.title,
    brideName: link.event.brideName,
    groomName: link.event.groomName,
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
  }));

  return <DownloadsList links={serializedLinks} />;
}
