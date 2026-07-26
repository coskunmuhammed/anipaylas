import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { getEventDisplayName } from '@/lib/eventUtils';
import QrGenerator from './QrGenerator';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ eventId?: string }>;
}

export default async function AdminQrPage({ searchParams }: PageProps) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;
  const eventId = resolvedSearchParams.eventId;

  const events = await prisma.event.findMany({
    where: { status: { not: 'DELETED' } },
    orderBy: { eventDate: 'desc' },
  });

  const selectedEventId = eventId || (events.length > 0 ? events[0].id : null);

  let selectedEvent = null;
  let stats = null;

  if (selectedEventId) {
    selectedEvent = events.find((e: any) => e.id === selectedEventId) || null;
    
    if (selectedEvent) {
      // Calculate Stats
      const totalScans = await prisma.qrScan.count({
        where: { eventId: selectedEventId },
      });

      const uniqueVisitorsRes = await prisma.qrScan.groupBy({
        by: ['visitorHash'],
        where: { eventId: selectedEventId },
      });
      const uniqueVisitors = uniqueVisitorsRes.length;

      const totalUploaders = await prisma.uploadSession.count({
        where: { eventId: selectedEventId, uploadedPhotoCount: { gt: 0 } },
      });

      // Device types breakdown
      const devices = await prisma.qrScan.groupBy({
        by: ['deviceType'],
        where: { eventId: selectedEventId },
        _count: { id: true },
      });

      // Hour of day breakdown
      const scans = await prisma.qrScan.findMany({
        where: { eventId: selectedEventId },
        select: { createdAt: true },
      });

      const hourCounts: Record<number, number> = {};
      scans.forEach((scan: any) => {
        const hour = new Date(scan.createdAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      let peakHour = -1;
      let maxScans = 0;
      Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxScans) {
          maxScans = count;
          peakHour = parseInt(hour, 10);
        }
      });

      stats = {
        totalScans,
        uniqueVisitors,
        totalUploaders,
        uploadRate: uniqueVisitors > 0 ? ((totalUploaders / uniqueVisitors) * 100).toFixed(1) : '0',
        peakHour: peakHour !== -1 ? `${peakHour}:00 - ${peakHour + 1}:00` : 'Veri yok',
        devices: devices.map((d: any) => ({
          type: d.deviceType || 'Bilinmeyen',
          count: d._count.id,
        })),
      };
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <QrGenerator 
      events={events.map((e: any) => ({ id: e.id, title: e.title, displayName: getEventDisplayName(e), shortCode: e.shortCode }))}
      selectedEvent={selectedEvent ? { id: selectedEvent.id, title: selectedEvent.title, displayName: getEventDisplayName(selectedEvent), shortCode: selectedEvent.shortCode } : null}
      stats={stats}
      appUrl={appUrl}
    />
  );
}
