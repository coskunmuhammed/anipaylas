/**
 * Centralized Helper for converting storage keys or relative paths to public /media URLs.
 */
export function getMediaUrl(keyOrUrl?: string | null): string {
  if (!keyOrUrl) return '';

  const trimmed = keyOrUrl.trim();

  // If already absolute HTTP(S) URL or data/blob URI, return as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // If already formatted with /media/, return as-is
  if (trimmed.startsWith('/media/')) {
    return trimmed;
  }

  // Legacy /uploads/ path fallback conversion
  if (trimmed.startsWith('/uploads/')) {
    const cleaned = trimmed.replace(/^\/uploads\//, '');
    return `/media/${cleaned.split('/').map(encodeURIComponent).join('/')}`;
  }

  // Relative storage key (e.g. "palm/services/abc.webp")
  const normalizedKey = trimmed.replace(/^\/+/, '');
  return `/media/${normalizedKey.split('/').map(encodeURIComponent).join('/')}`;
}
