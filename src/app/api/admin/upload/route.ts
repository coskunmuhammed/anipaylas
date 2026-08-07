import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { PALM_MEDIA_ROOT, PALM_CATEGORIES, PalmCategory, ensurePalmStorageDirs } from '@/lib/storage/config';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const categoryInput = (formData.get('category') as string) || 'miscellaneous';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Lütfen yüklenecek bir fotoğraf dosyası seçin.' },
        { status: 400 }
      );
    }

    // MIME type check
    const mime = file.type.toLowerCase();
    if (!file.type.startsWith('image/') || !ALLOWED_MIME_TYPES.includes(mime)) {
      if (mime === 'image/svg+xml') {
        return NextResponse.json(
          { success: false, error: 'Güvenlik nedeniyle SVG dosya formatı desteklenmemektedir. Lütfen WebP, JPG veya PNG yükleyin.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Sadece geçerli görsel dosyaları (JPEG, PNG, WebP, HEIC) yüklenebilir.' },
        { status: 400 }
      );
    }

    // Size limit check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Görsel boyutu en fazla 15 MB olabilir.' },
        { status: 400 }
      );
    }

    // Determine category
    const category: PalmCategory = (PALM_CATEGORIES as readonly string[]).includes(categoryInput)
      ? (categoryInput as PalmCategory)
      : 'miscellaneous';

    ensurePalmStorageDirs();

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    // Sharp optimization pipeline
    const maxWidth = category === 'hero' ? 2400 : 1600;
    const processedBuffer = await sharp(inputBuffer)
      .rotate() // Auto orientation from EXIF
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Unique filename & key creation
    const fileUuid = crypto.randomUUID();
    const fileName = `${fileUuid}.webp`;
    const storageKey = `palm/${category}/${fileName}`;
    const targetDir = path.join(PALM_MEDIA_ROOT, category);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, fileName);
    await fs.promises.writeFile(filePath, processedBuffer);

    // Verify written file
    const stat = await fs.promises.stat(filePath);
    if (!stat || stat.size === 0) {
      throw new Error('Dosya disk üzerine yazılamadı (0 bytes).');
    }

    const publicUrl = `/media/${storageKey}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      storageKey,
      fileName,
      sizeBytes: stat.size,
      mimeType: 'image/webp',
    });
  } catch (error: any) {
    console.error('Error in Admin CMS upload pipeline:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sunucuya yükleme yapılırken hata oluştu.' },
      { status: 500 }
    );
  }
}
