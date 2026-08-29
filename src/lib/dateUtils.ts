/**
 * Centralized Date & Timezone Utilities for Palm Stüdyo
 * Canonical Timezone Policy: Europe/Istanbul (UTC+3)
 */

export const TURKEY_TIMEZONE = 'Europe/Istanbul';

export interface EventTimeInput {
  eventDate: Date | string;
  startTime?: string | null;
  endTime?: string | null;
  uploadStartsAt?: Date | string | null;
  uploadEndsAt?: Date | string | null;
}

export interface EventWindowResult {
  startsAt: Date;
  endsAt: Date;
  hasStarted: boolean;
  hasEnded: boolean;
  isActive: boolean;
  startsAtFormatted: string;
  endsAtFormatted: string;
}

/**
 * Extracts YYYY-MM-DD from string or Date cleanly without UTC shifting
 */
export function extractCalendarDateParts(eventDate: Date | string): { year: number; month: number; day: number } {
  if (typeof eventDate === 'string') {
    const trimmed = eventDate.trim();
    if (trimmed.includes('T')) {
      const isoDate = new Date(trimmed);
      return {
        year: isoDate.getUTCFullYear(),
        month: isoDate.getUTCMonth() + 1,
        day: isoDate.getUTCDate(),
      };
    }
    const [yearStr, monthStr, dayStr] = trimmed.substring(0, 10).split('-');
    return {
      year: parseInt(yearStr, 10) || new Date().getFullYear(),
      month: parseInt(monthStr, 10) || 1,
      day: parseInt(dayStr, 10) || 1,
    };
  }

  // JS Date instance
  return {
    year: eventDate.getUTCFullYear(),
    month: eventDate.getUTCMonth() + 1,
    day: eventDate.getUTCDate(),
  };
}

/**
 * Parses "HH:mm" time string into hours and minutes
 */
export function parseTimeString(timeStr?: string | null, defaultTime = '00:00'): { hours: number; minutes: number } {
  const safeTime = (timeStr && timeStr.trim().includes(':')) ? timeStr.trim() : defaultTime;
  const [hStr, mStr] = safeTime.split(':');
  const hours = Math.max(0, Math.min(23, parseInt(hStr, 10) || 0));
  const minutes = Math.max(0, Math.min(59, parseInt(mStr, 10) || 0));
  return { hours, minutes };
}

/**
 * Creates a Date instance representing local Turkey time (Europe/Istanbul UTC+3)
 */
export function createTurkeyDate(year: number, month: number, day: number, hours: number, minutes: number): Date {
  // Turkey is UTC+3 continuously. Subtract 3 hours for UTC representation.
  return new Date(Date.UTC(year, month - 1, day, hours - 3, minutes, 0, 0));
}

/**
 * Formats a Date object in Turkish format: dd.MM.yyyy HH:mm (Europe/Istanbul)
 */
export function formatTurkishDateTime(date: Date): string {
  const parts = new Intl.DateTimeFormat('tr-TR', {
    timeZone: TURKEY_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const map: Record<string, string> = {};
  parts.forEach((p) => {
    map[p.type] = p.value;
  });

  return `${map.day}.${map.month}.${map.year} ${map.hour}:${map.minute}`;
}

/**
 * Canonical calculation of Event Upload Window
 */
export function getEventWindow(event: EventTimeInput, now = new Date()): EventWindowResult {
  const { year, month, day } = extractCalendarDateParts(event.eventDate);
  const startObj = parseTimeString(event.startTime, '18:00');
  const endObj = parseTimeString(event.endTime, '02:00');

  const startsAt = createTurkeyDate(year, month, day, startObj.hours, startObj.minutes);

  // Check if end time is on the same day or next day (overnight)
  const startMinutesTotal = startObj.hours * 60 + startObj.minutes;
  const endMinutesTotal = endObj.hours * 60 + endObj.minutes;

  let durationMinutes = endMinutesTotal - startMinutesTotal;
  if (durationMinutes <= 0) {
    // Overnight event crossing midnight into the next day
    durationMinutes += 24 * 60;
  }

  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000);

  const hasStarted = now >= startsAt;
  const hasEnded = now > endsAt;
  const isActive = hasStarted && !hasEnded;

  return {
    startsAt,
    endsAt,
    hasStarted,
    hasEnded,
    isActive,
    startsAtFormatted: formatTurkishDateTime(startsAt),
    endsAtFormatted: formatTurkishDateTime(endsAt),
  };
}
