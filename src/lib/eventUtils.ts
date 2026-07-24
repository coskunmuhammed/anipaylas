import { EventType, SubjectType } from '@prisma/client';

export interface EventLike {
  eventType?: EventType | string | null;
  subjectType?: SubjectType | string | null;
  brideName?: string | null;
  groomName?: string | null;
  hostName?: string | null;
  title?: string | null;
}

/**
 * Returns default SubjectType for a given EventType.
 */
export function getDefaultSubjectType(eventType: EventType | string): SubjectType {
  switch (eventType) {
    case 'WEDDING':
    case 'ENGAGEMENT':
    case 'HENNA':
    case 'PROMISE':
      return 'COUPLE';
    case 'CORPORATE':
      return 'ORGANIZATION';
    case 'BIRTHDAY':
    case 'GRADUATION':
    case 'BABY_SHOWER':
    case 'PARTY':
    case 'OTHER':
    default:
      return 'PERSON';
  }
}

/**
 * Returns default welcome title and welcome message based on EventType.
 */
export function getDefaultWelcomeText(eventType: EventType | string): { title: string; message: string } {
  switch (eventType) {
    case 'WEDDING':
      return {
        title: 'Düğün Albümümüze Hoş Geldiniz',
        message: 'Bu özel günümüzde çektiğiniz güzel anıları bizimle paylaşın.',
      };
    case 'ENGAGEMENT':
      return {
        title: 'Nişan Albümümüze Hoş Geldiniz',
        message: 'Nişan törenimizden en güzel anları bizimle paylaşın.',
      };
    case 'HENNA':
      return {
        title: 'Kına Gecesi Albümümüze Hoş Geldiniz',
        message: 'Kına gecemizden en özel kareleri bizimle paylaşın.',
      };
    case 'PROMISE':
      return {
        title: 'Söz Albümümüze Hoş Geldiniz',
        message: 'Söz törenimizden güzel anıları bizimle paylaşın.',
      };
    case 'BIRTHDAY':
      return {
        title: 'Doğum Günü Albümüne Hoş Geldiniz',
        message: 'Bu eğlenceli günden yakaladığınız güzel kareleri bizimle paylaşın.',
      };
    case 'GRADUATION':
      return {
        title: 'Mezuniyet Töreni Albümüne Hoş Geldiniz',
        message: 'Mezuniyet töreninden en güzel anıları bizimle paylaşın.',
      };
    case 'BABY_SHOWER':
      return {
        title: 'Baby Shower Albümümüze Hoş Geldiniz',
        message: 'Bu tatlı heyecanımızdan en güzel kareleri bizimle paylaşın.',
      };
    case 'CORPORATE':
      return {
        title: 'Etkinlik Albümüne Hoş Geldiniz',
        message: 'Etkinlik boyunca çektiğiniz fotoğrafları paylaşabilirsiniz.',
      };
    case 'PARTY':
      return {
        title: 'Parti Albümüne Hoş Geldiniz',
        message: 'Partide yakaladığınız eğlenceli anları bizimle paylaşın.',
      };
    case 'OTHER':
    default:
      return {
        title: 'Etkinlik Albümüne Hoş Geldiniz',
        message: 'Etkinliğimizden en güzel anları bizimle paylaşın.',
      };
  }
}

/**
 * Determines exact event display name strictly following fallback rules:
 * - COUPLE: If both brideName & groomName present -> "Bride & Groom". Otherwise fallback to event.title.
 * - PERSON / ORGANIZATION: If hostName present -> hostName. Otherwise fallback to event.title.
 * Never outputs "undefined", " & ", or empty string.
 */
export function getEventDisplayName(event: EventLike): string {
  const subjectType = event.subjectType || (event.brideName && event.groomName ? 'COUPLE' : 'PERSON');
  const titleFallback = event.title?.trim() || 'Etkinlik';

  if (subjectType === 'COUPLE') {
    const bride = event.brideName?.trim();
    const groom = event.groomName?.trim();
    if (bride && groom) {
      return `${bride} & ${groom}`;
    }
    return titleFallback;
  }

  const host = event.hostName?.trim();
  if (host) {
    return host;
  }

  return titleFallback;
}

/**
 * Normalizes and strictly validates Instagram handle input.
 * Rejects plain homepages, post/reel URLs, query strings, empty inputs, usernames > 30 chars, or invalid chars.
 * Returns clean username string or null if invalid.
 */
export function normalizeInstagramUsername(input: string | null | undefined): string | null {
  if (!input) return null;
  let raw = input.trim();
  if (!raw) return null;

  // Reject query strings or fragments
  if (raw.includes('?') || raw.includes('#')) return null;

  // If full URL provided
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.toLowerCase().includes('instagram.com')) {
    const lower = raw.toLowerCase();
    // Reject post, reel, stories URLs
    if (lower.includes('/p/') || lower.includes('/reel/') || lower.includes('/reels/') || lower.includes('/stories/')) {
      return null;
    }

    try {
      const formattedUrl = raw.startsWith('http') ? raw : `https://${raw}`;
      const parsed = new URL(formattedUrl);
      const segments = parsed.pathname.split('/').filter((s) => s.length > 0);
      
      // If no segment (e.g. https://instagram.com/), reject homepage
      if (segments.length === 0) return null;
      
      raw = segments[0];
    } catch {
      return null;
    }
  }

  // Remove leading @ if present
  if (raw.startsWith('@')) {
    raw = raw.substring(1);
  }

  // Validate Instagram handle format (1-30 chars, alphanumeric + dots & underscores)
  const isValid = /^[a-zA-Z0-9._]{1,30}$/.test(raw);
  if (!isValid) return null;

  return raw;
}
