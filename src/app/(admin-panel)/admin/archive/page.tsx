import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import ArchiveList from './ArchiveList';

export const dynamic = 'force-dynamic';

export default async function AdminArchivePage() {
  await requireAdmin();

  const events = await prisma.event.findMany({
    where: { status: 'ARCHIVED' },
    orderBy: { eventDate: 'desc' },
  });

  const serializedEvents = events.map((event: any) => ({
    id: event.id,
    title: event.title,
    eventType: event.eventType,
    subjectType: event.subjectType,
    brideName: event.brideName,
    groomName: event.groomName,
    hostName: event.hostName,
    eventDate: event.eventDate.toLocaleDateString('tr-TR'),
    currentPhotoCount: event.currentPhotoCount,
  }));

  return <ArchiveList events={serializedEvents} />;
}
