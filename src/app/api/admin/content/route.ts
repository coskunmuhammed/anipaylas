import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getHomepageContent, updateHomepageContent } from '@/services/siteContent.service';
import { revalidatePath } from 'next/cache';

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
    
    try {
      revalidatePath('/');
      revalidatePath('/api/content/homepage');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, data: updated, message: 'Anasayfa içeriği başarıyla güncellendi.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'İçerik güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}
