import crypto from 'crypto';

// Earth radius in meters
const EARTH_RADIUS_METERS = 6371000;

// Maximum allowed GPS accuracy radius (in meters) to consider a GPS fix reliable
export const GPS_ACCURACY_THRESHOLD_METERS = 500;

// Secret key for signing location verification tokens
const LOCATION_HMAC_SECRET = process.env.JWT_SECRET || process.env.DOWNLOAD_TOKEN_ENCRYPTION_KEY || 'palm-studio-location-geofence-secret-key-2026';

/**
 * Calculates straight-line (great-circle) distance between two GPS coordinates in meters
 * using the Haversine formula.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_METERS * c);
}

export interface LocationTokenPayload {
  eventId: string;
  verifiedAt: number;
  expiresAt: number;
}

/**
 * Generates an HMAC-signed location verification token bound to a specific event ID.
 * Default validity: 60 minutes.
 */
export function createLocationToken(eventId: string, durationMinutes: number = 60): string {
  const now = Date.now();
  const expiresAt = now + durationMinutes * 60 * 1000;

  const payload: LocationTokenPayload = {
    eventId,
    verifiedAt: now,
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', LOCATION_HMAC_SECRET)
    .update(`${eventId}:${payloadBase64}`)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies a location token's HMAC signature and checks if it matches the target eventId and hasn't expired.
 */
export function verifyLocationToken(
  token: string | undefined | null,
  targetEventId: string
): { valid: boolean; reason?: string; payload?: LocationTokenPayload } {
  if (!token) {
    return { valid: false, reason: 'TOKEN_MISSING' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'TOKEN_MALFORMED' };
  }

  const [payloadBase64, signature] = parts;

  try {
    const payload: LocationTokenPayload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf8')
    );

    if (payload.eventId !== targetEventId) {
      return { valid: false, reason: 'TOKEN_EVENT_MISMATCH' };
    }

    const expectedSignature = crypto
      .createHmac('sha256', LOCATION_HMAC_SECRET)
      .update(`${payload.eventId}:${payloadBase64}`)
      .digest('base64url');

    // Timing safe comparison
    const sigBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false, reason: 'TOKEN_INVALID_SIGNATURE' };
    }

    if (Date.now() > payload.expiresAt) {
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, reason: 'TOKEN_PARSE_ERROR' };
  }
}
