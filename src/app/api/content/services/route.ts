import { NextResponse } from 'next/server';
import { getServicesContent } from '@/services/siteContent.service';

export async function GET() {
  try {
    const services = await getServicesContent();
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Hizmetler yüklenemedi.' }, { status: 500 });
  }
}
