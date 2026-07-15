import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface RouteProps {
  params: Promise<{ shortCode: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const { shortCode } = await params;

    // Find the event
    const event = await prisma.event.findUnique({
      where: { shortCode },
    });

    if (!event || event.status === 'DELETED') {
      return new Response('Etkinlik bulunamadı.', { status: 404 });
    }

    // Track visitor hash cookie
    let visitorHash = req.cookies.get('visitor_hash')?.value;
    
    // Redirect to the event upload page
    const redirectUrl = new URL(`/event/${shortCode}`, req.url);
    const response = NextResponse.redirect(redirectUrl);

    if (!visitorHash) {
      visitorHash = crypto.randomUUID();
      response.cookies.set('visitor_hash', visitorHash, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    // Parse User-Agent for device type
    const userAgent = req.headers.get('user-agent') || '';
    let deviceType = 'Masaüstü';
    if (/iPad|Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      deviceType = 'Mobil';
    }

    // Record the scan analytics asynchronously
    await prisma.qrScan.create({
      data: {
        eventId: event.id,
        visitorHash,
        userAgent: userAgent.substring(0, 255),
        deviceType,
      },
    });

    return response;
  } catch (error) {
    console.error('Error redirecting QR link:', error);
    return new Response('Sunucu hatası.', { status: 500 });
  }
}
