import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { clearEventStorage } from '@/lib/eventDeletion';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();

    const body = await req.json().catch(() => ({}));
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'Etkinlik seçilmelidir.' }, { status: 400 });
    }

    const result = await clearEventStorage(eventId, adminSession.userId);

    if (!result.success) {
      return NextResponse.json({ error: result.message || 'Depolama temizlenemedi.' }, { status: 400 });
    }

    // Invalidate next.js page caches
    try {
      revalidatePath('/admin/events');
      revalidatePath('/admin/storage');
      revalidatePath('/admin/photos');
      revalidatePath('/admin');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      deletedPhotosCount: result.deletedPhotosCount,
    });
  } catch (error: any) {
    console.error('Error in POST /api/admin/storage/clean-event:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
