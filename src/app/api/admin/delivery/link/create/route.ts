import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function generateRandomToken(length = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars[crypto.randomInt(0, chars.length)];
  }
  return token;
}

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
      // Set to end of selected day (23:59:59)
      expiresAt = new Date(customExpiryDate + 'T23:59:59.999Z');
    } else {
      return NextResponse.json({ error: 'Geçersiz son geçerlilik süresi.' }, { status: 400 });
    }

    // Generate secure token and its hash
    const token = generateRandomToken(12);
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Hash password if supplied
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    // Create download link in DB
    const downloadLink = await prisma.downloadLink.create({
      data: {
        eventId,
        deliveryPackageId,
        tokenHash,
        passwordHash,
        expiresAt,
        maxDownloadCount: parseInt(maxDownloads, 10) || 10,
        isActive: true,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: adminSession.userId,
        action: 'CREATE_DOWNLOAD_LINK',
        entityType: 'DownloadLink',
        entityId: downloadLink.id,
        metadata: JSON.stringify({ packageId: deliveryPackageId, expiresAt }),
      },
    });

    // Return the raw token back to admin (it is not stored raw in DB)
    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    console.error('Error creating download link:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
