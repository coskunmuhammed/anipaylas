import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createOrRegenerateDownloadLink } from '@/services/downloadLink.service';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();

    const {
      eventId,
      deliveryPackageId,
      expiryOption,
      customExpiryDate,
      maxDownloads,
      password,
    } = await req.json();

    if (!eventId || !deliveryPackageId || !expiryOption) {
      return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
    }

    // Verify package exists
    const pkg = await prisma.deliveryPackage.findUnique({
      where: { id: deliveryPackageId },
    });

    if (!pkg || pkg.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Geçersiz veya tamamlanmamış albüm paketi.' }, { status: 400 });
    }

    // Calculate expiry
    let expiresAt = new Date();
    if (expiryOption === '7') {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else if (expiryOption === '15') {
      expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    } else if (expiryOption === '30') {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (expiryOption === 'custom' && customExpiryDate) {
      expiresAt = new Date(customExpiryDate + 'T23:59:59.999Z');
    } else {
      return NextResponse.json({ error: 'Geçersiz son geçerlilik süresi.' }, { status: 400 });
    }

    // Hash password if supplied
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    // Use unified service for atomic creation with encryption and single active link guarantee
    const result = await createOrRegenerateDownloadLink({
      eventId,
      deliveryPackageId,
      expiresAt,
      maxDownloadCount: parseInt(maxDownloads, 10) || 10,
      passwordHash,
      adminUserId: adminSession.userId,
    });

    return NextResponse.json({ success: true, token: result.rawToken, linkId: result.downloadLinkId });
  } catch (error: unknown) {
    console.error('Error creating download link:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
