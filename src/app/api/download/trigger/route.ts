import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSignedDownloadUrl } from '@/lib/storage';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  let downloadLinkId = '';
  const visitorHash = req.cookies.get('visitor_hash')?.value || crypto.randomUUID();
  const userAgent = req.headers.get('user-agent') || 'Unknown';

  try {
    const { token, password } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Bağlantı tokeni eksik.' }, { status: 400 });
    }

    // Hash token
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find link
    const link = await prisma.downloadLink.findUnique({
      where: { tokenHash },
      include: {
        event: true,
        deliveryPackage: true,
      },
    });

    if (!link || link.event.status === 'DELETED') {
      return NextResponse.json({ error: 'İndirme bağlantısı bulunamadı.' }, { status: 404 });
    }

    downloadLinkId = link.id;

    // 1. Status checks
    if (!link.isActive || link.revokedAt !== null) {
      await logDownload(downloadLinkId, visitorHash, userAgent, false);
      return NextResponse.json({ error: 'Bu indirme bağlantısı devre dışı bırakılmıştır.' }, { status: 403 });
    }

    // 2. Expiration check
    if (new Date() > link.expiresAt) {
      await logDownload(downloadLinkId, visitorHash, userAgent, false);
      return NextResponse.json({ error: 'Bu bağlantının indirme süresi sona ermiştir.' }, { status: 403 });
    }

    // 3. Download limit check
    if (link.currentDownloadCount >= link.maxDownloadCount) {
      await logDownload(downloadLinkId, visitorHash, userAgent, false);
      return NextResponse.json({ error: 'Maksimum indirme limitine ulaşılmıştır.' }, { status: 403 });
    }

    // 4. Password validation if required
    if (link.passwordHash) {
      if (!password) {
        return NextResponse.json({ error: 'Şifre gereklidir.' }, { status: 401 });
      }
      const isMatch = await bcrypt.compare(password, link.passwordHash);
      if (!isMatch) {
        await logDownload(downloadLinkId, visitorHash, userAgent, false);
        return NextResponse.json({ error: 'Hatalı şifre girdiniz.' }, { status: 401 });
      }
    }

    // 5. Package status check
    const pkg = link.deliveryPackage;
    if (pkg.status !== 'COMPLETED' || !pkg.archiveStorageKey) {
      await logDownload(downloadLinkId, visitorHash, userAgent, false);
      return NextResponse.json({ error: 'Albüm dosyası bulunamadı.' }, { status: 404 });
    }

    // 6. Generate secure signed URL for archive ZIP (Valid for 30 minutes)
    const downloadUrl = await getSignedDownloadUrl(pkg.archiveStorageKey, 1800);

    // 7. Increment count and log success
    await prisma.downloadLink.update({
      where: { id: link.id },
      data: {
        currentDownloadCount: { increment: 1 },
        lastDownloadedAt: new Date(),
      },
    });

    await logDownload(downloadLinkId, visitorHash, userAgent, true);

    return NextResponse.json({ success: true, downloadUrl });
  } catch (error: any) {
    console.error('Download trigger error:', error);
    if (downloadLinkId) {
      await logDownload(downloadLinkId, visitorHash, userAgent, false);
    }
    return NextResponse.json({ error: 'İndirme başlatılırken sunucu hatası oluştu.' }, { status: 500 });
  }
}

async function logDownload(downloadLinkId: string, visitorHash: string, userAgent: string, success: boolean) {
  try {
    await prisma.downloadLog.create({
      data: {
        downloadLinkId,
        visitorHash,
        userAgent: userAgent.substring(0, 255),
        success,
      },
    });
  } catch (err) {
    console.error('Failed to write download log:', err);
  }
}
