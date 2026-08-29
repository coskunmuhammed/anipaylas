import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getServicesContent, updateServicesContent } from '@/services/siteContent.service';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const services = await getServicesContent();
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Hizmet bilgileri yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Geçersiz veri formatı.' }, { status: 400 });
    }
    const updated = await updateServicesContent(body);
    
    try {
      revalidatePath('/');
      revalidatePath('/hizmetler');
      revalidatePath('/api/content/services');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, data: updated, message: 'Hizmet içerikleri ve görselleri kaydedildi.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Hizmet bilgileri güncellenirken hata oluştu.' }, { status: 500 });
  }
}
