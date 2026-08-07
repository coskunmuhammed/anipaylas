import { NextResponse } from 'next/server';
import { getHomepageContent } from '@/services/siteContent.service';

export async function GET() {
  try {
    const content = await getHomepageContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'İçerik yüklenemedi.' }, { status: 500 });
  }
}
