import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Lütfen yüklenecek bir fotoğraf dosyası seçin.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Sadece fotoğraf (Görsel) dosyaları yüklenebilir.' }, { status: 400 });
    }

    // 50MB Max file size for CMS images
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Fotoğraf boyutu 50MB sınırını aşamaz.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine extension
    const ext = path.extname(file.name) || (file.type.includes('png') ? '.png' : file.type.includes('webp') ? '.webp' : '.jpg');
    const randomHash = crypto.randomBytes(6).toString('hex');
    const fileName = `cms-${Date.now()}-${randomHash}${ext}`;

    // Target upload dir: public/uploads/cms (Served static by Next.js & VPS webservers)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cms');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/cms/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error: any) {
    console.error('Error uploading CMS file:', error);
    return NextResponse.json({ success: false, error: error.message || 'Sunucuya yükleme yapılırken hata oluştu.' }, { status: 500 });
  }
}
