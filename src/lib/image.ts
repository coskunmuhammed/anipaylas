import sharp from 'sharp';
// @ts-ignore
import heicConvert from 'heic-convert';

function isHeic(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  const brand = buffer.toString('ascii', 8, 12);
  return ['heic', 'heix', 'mif1', 'hevc'].includes(brand);
}

export interface ProcessedImages {
  originalBuffer: Buffer;
  originalMime: string;
  originalExt: string;
  galleryBuffer: Buffer;
  thumbnailBuffer: Buffer;
  width: number;
  height: number;
}

export async function processImage(
  inputBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ProcessedImages> {
  let buffer = inputBuffer;
  let ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  let finalMime = mimeType;

  // Convert HEIC to JPEG
  if (isHeic(buffer) || ext === 'heic' || ext === 'heif' || mimeType.includes('heic') || mimeType.includes('heif')) {
    try {
      buffer = await heicConvert({
        buffer,
        format: 'JPEG',
        quality: 0.92,
      }).then((res: any) => Buffer.from(res));
      ext = 'jpg';
      finalMime = 'image/jpeg';
    } catch (err) {
      console.error('HEIC conversion failed:', err);
      throw new Error('HEIC dosyası dönüştürülemedi. Dosya bozuk olabilir.');
    }
  }

  // Load image with sharp for validation
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata || !metadata.width || !metadata.height) {
    throw new Error('Dosya geçerli bir görsel formatı değil.');
  }

  // Auto rotate and strip EXIF (sharp auto-strips unless keepMetadata is called)
  const originalProcessed = await image
    .rotate()
    .toBuffer();

  const orientedMetadata = await sharp(originalProcessed).metadata();
  const width = orientedMetadata.width || metadata.width;
  const height = orientedMetadata.height || metadata.height;

  // Generate Gallery size (max 1600px, WebP format)
  const galleryBuffer = await sharp(originalProcessed)
    .resize(1600, 1600, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  // Generate Thumbnail size (max 400px, WebP format)
  const thumbnailBuffer = await sharp(originalProcessed)
    .resize(400, 400, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  return {
    originalBuffer: originalProcessed,
    originalMime: finalMime,
    originalExt: ext,
    galleryBuffer,
    thumbnailBuffer,
    width,
    height,
  };
}
