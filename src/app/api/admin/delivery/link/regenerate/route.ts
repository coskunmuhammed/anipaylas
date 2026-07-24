import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createOrRegenerateDownloadLink } from '@/services/downloadLink.service';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();
    const { linkId, deliveryPackageId: paramPackageId } = await req.json();

    const targetLinkId = linkId;
    let targetPackageId = paramPackageId;
    let eventId = '';
    let passwordHash: string | null = null;
    let maxDownloadCount = 10;

    if (targetLinkId) {
      const existing = await prisma.downloadLink.findUnique({
        where: { id: targetLinkId },
      });
      if (!existing) {
        return NextResponse.json({ error: 'İndirme bağlantısı bulunamadı.' }, { status: 404 });
      }
      targetPackageId = existing.deliveryPackageId;
      eventId = existing.eventId;
      passwordHash = existing.passwordHash;
      maxDownloadCount = existing.maxDownloadCount;
    } else if (targetPackageId) {
      const pkg = await prisma.deliveryPackage.findUnique({
        where: { id: targetPackageId },
      });
      if (!pkg) {
        return NextResponse.json({ error: 'Paket bulunamadı.' }, { status: 404 });
      }
      eventId = pkg.eventId;
    } else {
      return NextResponse.json({ error: 'Bağlantı veya paket kimliği eksik.' }, { status: 400 });
    }

    // Default new expiry date: 15 days from now
    const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    // Call unified service for atomic transaction and single active link guarantee
    const result = await createOrRegenerateDownloadLink({
      eventId,
      deliveryPackageId: targetPackageId,
      expiresAt,
      maxDownloadCount,
      passwordHash,
      adminUserId: adminSession.userId,
    });

    return NextResponse.json({
      success: true,
      token: result.rawToken,
      linkId: result.downloadLinkId,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (error: unknown) {
    console.error('Error regenerating download link:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
