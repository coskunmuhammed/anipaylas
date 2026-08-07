import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getHomepageContent, updateHomepageContent } from '@/services/siteContent.service';

export async function GET() {
  try {
    const content = await getHomepageContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'İçerik yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const updated = await updateHomepageContent(body);
    return NextResponse.json({ success: true, data: updated, message: 'Anasayfa içeriği başarıyla güncellendi.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'İçerik güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}
