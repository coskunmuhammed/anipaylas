/**
 * Centralized URL Helper Utility for Palm Stüdyo & Event Flow
 */

const PRODUCTION_ORIGIN = 'https://palmstudio.com.tr';

/**
 * Returns the public application base origin URL without a trailing slash.
 * Production environments NEVER fall back to localhost.
 */
export function getPublicAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_ORIGIN;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.includes('172.')) {
      return origin.replace(/\/+$/, '');
    }
  }

  return 'http://localhost:3000';
}

export function getBaseUrl(): string {
  return getPublicAppUrl();
}

export function getEventLandingUrl(shortCode: string): string {
  return `${getPublicAppUrl()}/etkinlik/${shortCode}`;
}

export function getEventUrl(shortCode: string): string {
  return getEventLandingUrl(shortCode);
}

export function getEventUploadUrl(shortCode: string): string {
  return `${getPublicAppUrl()}/etkinlik/${shortCode}/fotograf-yukle`;
}

export function getQrUrl(shortCode: string): string {
  return `${getPublicAppUrl()}/q/${shortCode}`;
}
