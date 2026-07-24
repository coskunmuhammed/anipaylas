import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { hashToken } from '@/lib/crypto';
import { getEventDisplayName } from '@/lib/eventUtils';
import { getSignedDownloadUrl } from '@/lib/storage';
import DownloadPortal from './DownloadPortal';
import '@/app/download/download.css';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function DownloadPage({ params }: PageProps) {
  const { token } = await params;

  // Compute standardized SHA-256 token hash
  const tokenHash = hashToken(token);

  // Query database
  const link = await prisma.downloadLink.findUnique({
    where: { tokenHash },
    include: {
      event: true,
      deliveryPackage: true,
    },
  });

  if (!link || link.event.status === 'DELETED') {
    notFound();
  }

  const now = new Date();
  let statusMessage = '';
  let isExpired = false;

  // Verify link status
  if (!link.isActive || link.revokedAt !== null) {
    statusMessage = 'Bu indirme bağlantısı platform yöneticisi tarafından iptal edilmiştir veya devre dışıdır.';
    isExpired = true;
  } else if (now > link.expiresAt) {
    statusMessage = 'Bu albümün indirme süresi sona ermiştir. Yeniden erişim talep etmek için bizimle iletişime geçebilirsiniz.';
    isExpired = true;
  } else if (link.currentDownloadCount >= link.maxDownloadCount) {
    statusMessage = 'Bu bağlantı için maksimum indirme limitine ulaşılmıştır. Yeniden erişim talep etmek için bizimle iletişime geçebilirsiniz.';
    isExpired = true;
  } else if (link.deliveryPackage.status !== 'COMPLETED') {
    statusMessage = 'Etkinlik albüm dosyası henüz hazır değil veya silinmiş. Lütfen daha sonra tekrar deneyin.';
    isExpired = true;
  }

  // Calculate remaining days
  const remainingTime = link.expiresAt.getTime() - now.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

  let signedCoverImageUrl: string | null = null;
  if (link.event.coverImageUrl) {
    signedCoverImageUrl = link.event.coverImageUrl.startsWith('http')
      ? link.event.coverImageUrl
      : await getSignedDownloadUrl(link.event.coverImageUrl);
  }

  const serializedData = {
    token,
    displayName: getEventDisplayName(link.event),
    eventDate: link.event.eventDate.toLocaleDateString('tr-TR'),
    coverImageUrl: signedCoverImageUrl,
    photoCount: link.deliveryPackage.photoCount,
    archiveSizeBytes: Number(link.deliveryPackage.archiveSizeBytes || 0),
    expiresAt: link.expiresAt.toLocaleDateString('tr-TR'),
    remainingDays,
    passwordRequired: link.passwordHash !== null,
  };

  return (
    <DownloadPortal 
      data={serializedData} 
      isExpired={isExpired} 
      statusMessage={statusMessage} 
    />
  );
}
