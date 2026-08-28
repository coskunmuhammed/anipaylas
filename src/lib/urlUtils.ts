/**
 * Centralized URL Helper Utility for Palm Stüdyo & Event Flow
 */

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Production fallback to Palm Stüdyo production domain
  if (process.env.NODE_ENV === 'production') {
    return 'https://palmstudio.com.tr';
  }

  return 'http://localhost:3000';
}

export function getEventLandingUrl(shortCode: string): string {
  const base = getBaseUrl();
  return `${base}/etkinlik/${shortCode}`;
}

export function getEventUploadUrl(shortCode: string): string {
  const base = getBaseUrl();
  return `${base}/etkinlik/${shortCode}/fotograf-yukle`;
}

export function getQrUrl(shortCode: string): string {
  const base = getBaseUrl();
  return `${base}/q/${shortCode}`;
}
