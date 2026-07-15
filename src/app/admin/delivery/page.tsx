import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import DeliveryManager from './DeliveryManager';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ eventId?: string }>;
}

export default async function AdminDeliveryPage({ searchParams }: PageProps) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;
  const eventId = resolvedSearchParams.eventId;

  const events = await prisma.event.findMany({
    where: { status: { not: 'DELETED' } },
    orderBy: { eventDate: 'desc' },
  });

  const selectedEventId = eventId || (events.length > 0 ? events[0].id : null);

  let selectedEvent = null;
  let packages: any[] = [];
  let stats = null;

  if (selectedEventId) {
    selectedEvent = events.find((e: any) => e.id === selectedEventId) || null;

    if (selectedEvent) {
      packages = await prisma.deliveryPackage.findMany({
        where: { eventId: selectedEventId, status: { not: 'DELETED' } },
        orderBy: { createdAt: 'desc' },
        include: { downloadLinks: true },
      });

      const totalApproved = await prisma.photo.count({
        where: { eventId: selectedEventId, status: 'APPROVED', deletedAt: null },
      });

      const totalSelected = await prisma.photo.count({
        where: { eventId: selectedEventId, status: 'APPROVED', isSelectedForDelivery: true, deletedAt: null },
      });

      stats = {
        totalApproved,
        totalSelected,
      };
    }
  }

  // Format packages (JSON serializable)
  const serializedPackages = packages.map((pkg: any) => ({
    id: pkg.id,
    eventId: pkg.eventId,
    status: pkg.status,
    photoCount: pkg.photoCount,
    archiveStorageKey: pkg.archiveStorageKey,
    archiveSizeBytes: pkg.archiveSizeBytes ? Number(pkg.archiveSizeBytes) : null,
    createdAt: pkg.createdAt.toISOString(),
    completedAt: pkg.completedAt ? pkg.completedAt.toISOString() : null,
    deletedAt: pkg.deletedAt ? pkg.deletedAt.toISOString() : null,
    linksCount: pkg.downloadLinks.length,
  }));

  return (
    <DeliveryManager 
      events={events.map((e: any) => ({ id: e.id, title: e.title }))}
      selectedEvent={selectedEvent ? { id: selectedEvent.id, title: selectedEvent.title } : null}
      packages={serializedPackages}
      stats={stats}
    />
  );
}
