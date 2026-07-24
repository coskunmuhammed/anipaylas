import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();
    const { linkId } = await req.json();

    if (!linkId) {
      return NextResponse.json({ error: 'Bağlantı ID gereklidir.' }, { status: 400 });
    }

    const link = await prisma.downloadLink.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      return NextResponse.json({ error: 'Bağlantı bulunamadı.' }, { status: 404 });
    }

    // Revoke the link
    await prisma.downloadLink.update({
      where: { id: linkId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: adminSession.userId,
        action: 'REVOKE_DOWNLOAD_LINK',
        entityType: 'DownloadLink',
        entityId: linkId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error revoking link:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
