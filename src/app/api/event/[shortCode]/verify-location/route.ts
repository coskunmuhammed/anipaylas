import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDistanceMeters, createLocationToken, GPS_ACCURACY_THRESHOLD_METERS } from '@/lib/location';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    const body = await req.json();

    const { latitude, longitude, accuracy } = body || {};

    if (latitude === undefined || longitude === undefined || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Geçersiz konum koordinatları.', code: 'INVALID_COORDINATES' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { shortCode },
      select: {
        id: true,
        shortCode: true,
        locationVerificationEnabled: true,
        latitude: true,
        longitude: true,
        geofenceRadiusMeters: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Etkinlik bulunamadı.', code: 'EVENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // If geofencing is not enabled for this event, allow immediately
    if (!event.locationVerificationEnabled) {
      return NextResponse.json({
        success: true,
        allowed: true,
        geofenceEnabled: false,
      });
    }

    // Ensure event has location configured
    if (event.latitude === null || event.longitude === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Etkinlik için henüz konum koordinatları tanımlanmamış.',
          code: 'LOCATION_NOT_CONFIGURED',
        },
        { status: 400 }
      );
    }

    // GPS accuracy check
    const guestAccuracy = typeof accuracy === 'number' ? accuracy : 0;
    if (guestAccuracy > GPS_ACCURACY_THRESHOLD_METERS) {
      return NextResponse.json(
        {
          success: false,
          allowed: false,
          code: 'POOR_GPS_ACCURACY',
          accuracy: guestAccuracy,
          error: 'Konumunuz yeterli hassasiyetle belirlenemedi. Lütfen GPS/konum servislerini açıp tekrar deneyin.',
        },
        { status: 400 }
      );
    }

    // Server-side Haversine distance calculation
    const distanceMeters = calculateDistanceMeters(
      latitude,
      longitude,
      event.latitude,
      event.longitude
    );

    const allowedRadiusMeters = event.geofenceRadiusMeters || 2500;

    if (distanceMeters <= allowedRadiusMeters) {
      // Create signed location token bound to event.id (60 minutes validity)
      const locationToken = createLocationToken(event.id, 60);

      const response = NextResponse.json({
        success: true,
        allowed: true,
        distanceMeters,
        allowedRadiusMeters,
        locationToken,
      });

      // Set cookie for browser sessions
      response.cookies.set(`location_token_${event.shortCode}`, locationToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 60 minutes
      });

      return response;
    } else {
      return NextResponse.json(
        {
          success: false,
          allowed: false,
          code: 'OUTSIDE_EVENT_AREA',
          distanceMeters,
          allowedRadiusMeters,
          error: 'Etkinlik alanının dışındasınız. Fotoğraf paylaşımı yalnızca etkinlik alanı içerisinden yapılabilir.',
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error verifying event location:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası oluştu.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
