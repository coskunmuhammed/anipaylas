import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();
    const { eventId, action } = await req.json();

    if (!eventId || !action) {
      return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı.' }, { status: 404 });
    }

    let nextStatus: any = event.status;
    if (action === 'reactivate') {
      nextStatus = 'ACTIVE';
    } else if (action === 'delete') {
      nextStatus = 'DELETED';
    } else {
      return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 400 });
    }

    // Update status in DB
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { status: nextStatus },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: adminSession.userId,
        action: `${action.toUpperCase()}_EVENT_FROM_ARCHIVE`,
        entityType: 'Event',
        entityId: eventId,
        metadata: JSON.stringify({ title: event.title }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing archive action:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
