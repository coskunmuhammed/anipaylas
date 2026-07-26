import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface RouteProps {
  params: Promise<{ shortCode: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const { shortCode } = await params;

    // 1. Find the event
    const event = await prisma.event.findUnique({
      where: { shortCode },
    });

    if (!event || event.status === 'DELETED') {
      return new Response('Etkinlik bulunamadı.', { status: 404 });
    }

    // 2. Track visitor hash cookie
    let visitorHash = req.cookies.get('visitor_hash')?.value;
    
    // Target Palm Stüdyo event landing page
    const redirectUrl = new URL(`/etkinlik/${shortCode}`, req.url);
    const response = NextResponse.redirect(redirectUrl);

    if (!visitorHash) {
      visitorHash = crypto.randomUUID();
      response.cookies.set('visitor_hash', visitorHash, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    // 3. Record scan analytics safely inside try-catch block (prevent DB error from halting scan flow)
    try {
      const userAgent = req.headers.get('user-agent') || '';
      let deviceType = 'Masaüstü';
      if (/iPad|Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        deviceType = 'Mobil';
      }

      await prisma.qrScan.create({
        data: {
          eventId: event.id,
          visitorHash,
          userAgent: userAgent.substring(0, 255),
          deviceType,
        },
      });
    } catch (scanErr) {
      console.error('Failed to log QrScan analytics:', scanErr);
    }

    // 4. Return redirect to Palm Stüdyo Event Landing Page
    return response;
  } catch (error) {
    console.error('Error redirecting QR link:', error);
    return new Response('Sunucu hatası.', { status: 500 });
  }
}
