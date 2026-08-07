import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { STORAGE_ROOT } from '@/lib/storage/config';

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.webp':
      return 'image/webp';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.heic':
      return 'image/heic';
    case '.heif':
      return 'image/heif';
    case '.pdf':
      return 'application/pdf';
    case '.zip':
      return 'application/zip';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await context.params;

    if (!segments || segments.length === 0) {
      return NextResponse.json({ error: 'Dosya yolu bulunamadı.' }, { status: 400 });
    }

    // 1. Path traversal check
    for (const segment of segments) {
      if (segment.includes('..') || segment.includes('\0') || segment.includes('/') || segment.includes('\\')) {
        return NextResponse.json({ error: 'Geçersiz dosya yolu.' }, { status: 400 });
      }
    }

    const relativePath = path.join(...segments);
    const resolvedStorageRoot = path.resolve(STORAGE_ROOT);
    let targetPath = path.resolve(resolvedStorageRoot, relativePath);

    // Security Check: Target file must remain inside STORAGE_ROOT
    if (!targetPath.startsWith(resolvedStorageRoot)) {
      return NextResponse.json({ error: 'Erişim engellendi.' }, { status: 403 });
    }

    // Fallback check: If not in STORAGE_ROOT, check if it was in legacy public/uploads
    if (!fs.existsSync(targetPath)) {
      const legacyPublicUploads = path.resolve(process.cwd(), 'public', 'uploads', ...segments);
      if (legacyPublicUploads.startsWith(path.resolve(process.cwd(), 'public')) && fs.existsSync(legacyPublicUploads)) {
        targetPath = legacyPublicUploads;
      } else {
        return NextResponse.json({ error: 'Medya dosyası bulunamadı.' }, { status: 404 });
      }
    }

    const stat = await fs.promises.stat(targetPath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: 'Belirtilen yol bir dosya değil.' }, { status: 400 });
    }

    const mimeType = getMimeType(targetPath);
    const fileStream = fs.createReadStream(targetPath);

    // Convert Node ReadStream to Web ReadableStream
    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error: any) {
    console.error('Error serving media file:', error);
    return NextResponse.json({ error: 'Sunucu medya hatası.' }, { status: 500 });
  }
}
