import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { saveFile, getFileBuffer } from '@/lib/storage';
import { getEventDisplayName } from '@/lib/eventUtils';
import JSZip from 'jszip';

// Background ZIP builder function running asynchronously
async function runZipGeneration(packageId: string, eventId: string) {
  try {
    console.log(`Starting ZIP generation for package ${packageId}...`);
    
    // 1. Fetch Event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new Error('Event not found');

    // 2. Fetch all approved photos (not soft deleted)
    const photos = await prisma.photo.findMany({
      where: { eventId, status: 'APPROVED', deletedAt: null },
    });

    if (photos.length === 0) {
      throw new Error('No approved photos found to compress.');
    }

    const zip = new JSZip();
    
    // Clean names to form safe directories
    const displayName = getEventDisplayName(event);
    const cleanDisplayName = displayName.replace(/\s+/g, '-').replace(/[^\w\-]/g, '') || 'Etkinlik';
    const folderName = `${cleanDisplayName}-Fotograflari`;
    const rootFolder = zip.folder(folderName);
    if (!rootFolder) throw new Error('Failed to create root folder in ZIP');

    const allPhotosFolder = rootFolder.folder('Tum-Fotograflar');
    const highlightsFolder = rootFolder.folder('One-Cikanlar');

    // 3. Load files and append to zip folders
    for (const photo of photos) {
      try {
        const fileBuffer = await getFileBuffer(photo.originalUrl);
        const safeName = `${photo.id}_${photo.originalFilename}`;
        
        allPhotosFolder?.file(safeName, fileBuffer);
        
        if (photo.isSelectedForDelivery) {
          highlightsFolder?.file(safeName, fileBuffer);
        }
      } catch (fileErr) {
        console.error(`Failed to pack photo ${photo.id} to ZIP:`, fileErr);
      }
    }

    // 4. Generate CSV index containing guest messages with UTF-8 BOM
    let csvContent = '\ufeff'; // Excel Turkish characters fix
    csvContent += 'Misafir Adi;Mesaj;Dosya Adi;Yukleme Tarihi\n';
    photos.forEach((photo: any) => {
      const name = (photo.guestName || 'Anonim').replace(/"/g, '""');
      const msg = (photo.guestMessage || '').replace(/"/g, '""').replace(/\n/g, ' ');
      const filename = photo.originalFilename.replace(/"/g, '""');
      const date = new Date(photo.uploadedAt).toLocaleString('tr-TR');
      csvContent += `"${name}";"${msg}";"${filename}";"${date}"\n`;
    });

    rootFolder.file('Misafir-Mesajlari.csv', csvContent);

    // 5. Compile ZIP archive
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 5 },
    });

    // 6. Save ZIP archive to S3 or Local storage
    const archiveKey = `deliveries/${event.id}/${packageId}.zip`;
    await saveFile(zipBuffer, archiveKey, 'application/zip');

    // 7. Update status to COMPLETED
    await prisma.deliveryPackage.update({
      where: { id: packageId },
      data: {
        status: 'COMPLETED',
        archiveStorageKey: archiveKey,
        archiveSizeBytes: BigInt(zipBuffer.length),
        completedAt: new Date(),
      },
    });

    console.log(`ZIP generation for package ${packageId} COMPLETED successfully!`);

  } catch (err: any) {
    console.error(`ZIP generation failed for package ${packageId}:`, err);
    try {
      await prisma.deliveryPackage.update({
        where: { id: packageId },
        data: {
          status: 'FAILED',
        },
      });
    } catch (dbErr) {
      console.error('Failed to write FAILED state to db:', dbErr);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();
    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Etkinlik seçilmelidir.' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı.' }, { status: 404 });
    }

    // Count photos to zip
    const totalApproved = await prisma.photo.count({
      where: { eventId, status: 'APPROVED', deletedAt: null },
    });

    if (totalApproved === 0) {
      return NextResponse.json({ error: 'Albüme eklenecek onaylanmış fotoğraf bulunamadı.' }, { status: 400 });
    }

    // Create Package record
    const deliveryPackage = await prisma.deliveryPackage.create({
      data: {
        eventId,
        status: 'PROCESSING',
        photoCount: totalApproved,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: adminSession.userId,
        action: 'START_ZIP_JOB',
        entityType: 'DeliveryPackage',
        entityId: deliveryPackage.id,
      },
    });

    // Run ZIP generation and await completion for Vercel Serverless environment
    await runZipGeneration(deliveryPackage.id, eventId);

    return NextResponse.json({ success: true, packageId: deliveryPackage.id });
  } catch (error: any) {
    console.error('Error initiating delivery generation:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
