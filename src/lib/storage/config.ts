import path from 'path';
import fs from 'fs';

export const STORAGE_ROOT =
  process.env.STORAGE_ROOT ||
  process.env.LOCAL_STORAGE_DIR ||
  (process.env.VERCEL ? '/tmp/storage' : path.join(process.cwd(), 'storage'));

export const PALM_MEDIA_ROOT = path.join(STORAGE_ROOT, 'palm');

export const PALM_CATEGORIES = [
  'hero',
  'services',
  'gallery',
  'concepts',
  'stories',
  'packages',
  'miscellaneous',
] as const;

export type PalmCategory = (typeof PALM_CATEGORIES)[number];

export function ensurePalmStorageDirs() {
  try {
    if (!fs.existsSync(PALM_MEDIA_ROOT)) {
      fs.mkdirSync(PALM_MEDIA_ROOT, { recursive: true });
    }
    for (const cat of PALM_CATEGORIES) {
      const catDir = path.join(PALM_MEDIA_ROOT, cat);
      if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true });
      }
    }
  } catch (error) {
    console.warn('Warning creating Palm storage directories:', error);
  }
}
