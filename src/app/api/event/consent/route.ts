import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { eventId, guestName, guestMessage, consentTextVersion } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Etkinlik bilgisi eksik.' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.status === 'DELETED') {
      return NextResponse.json({ error: 'Etkinlik bulunamadı.' }, { status: 404 });
    }

    if (event.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Bu etkinlik fotoğraf yüklemelerine kapalıdır.' }, { status: 403 });
    }

    // Check total event photo limits
    if (event.currentPhotoCount >= event.maxTotalPhotos) {
      return NextResponse.json({ error: 'Düğün albümü için maksimum fotoğraf yükleme sınırı dolmuştur.' }, { status: 403 });
    }

    // Check storage limits
    if (event.currentStorageBytes >= event.maxStorageBytes) {
      return NextResponse.json({ error: 'Düğün albümü için depolama alanı kotası dolmuştur.' }, { status: 403 });
    }

    // Get visitor hash from cookie or fallback to new UUID
    const visitorHash = req.cookies.get('visitor_hash')?.value || crypto.randomUUID();

    // Create unique session token
    const sessionToken = crypto.randomUUID();

    // Session valid for 1 day
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Save session
    const session = await prisma.uploadSession.create({
      data: {
        eventId,
        sessionToken,
        visitorHash,
        guestName: guestName || 'Anonim',
        expiresAt,
      },
    });

    // Save consent log
    await prisma.consentLog.create({
      data: {
        eventId,
        uploadSessionId: session.id,
        consentTextVersion: consentTextVersion || 'v1.0',
        visitorHash,
      },
    });

    return NextResponse.json({ success: true, sessionToken });
  } catch (error) {
    console.error('Consent error:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
