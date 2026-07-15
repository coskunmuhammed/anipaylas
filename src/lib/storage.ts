import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export function getStorageDir(): string {
  if (process.env.VERCEL) {
    return '/tmp/storage';
  }
  return process.env.LOCAL_STORAGE_DIR || path.join(process.cwd(), 'storage');
}

const PROVIDER = process.env.STORAGE_PROVIDER || 'local';
const LOCAL_DIR = getStorageDir();

// Ensure local directory exists safely
if (PROVIDER === 'local') {
  try {
    if (!fs.existsSync(LOCAL_DIR)) {
      fs.mkdirSync(LOCAL_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn('Local storage dir warning:', e);
  }
}

// S3 Client configuration
let s3Client: S3Client | null = null;
if (PROVIDER === 's3') {
  s3Client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  });
}

export async function saveFile(
  buffer: Buffer,
  storageKey: string,
  mimeType: string
): Promise<string> {
  if (PROVIDER === 's3' && s3Client) {
    const bucket = process.env.S3_BUCKET_NAME || '';
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: storageKey,
        Body: buffer,
        ContentType: mimeType,
      })
    );
    const prefix = process.env.S3_PUBLIC_URL_PREFIX || '';
    if (prefix) {
      return `${prefix}/${storageKey}`;
    }
    return storageKey;
  } else {
    const targetPath = path.join(LOCAL_DIR, storageKey);
    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    await fs.promises.writeFile(targetPath, buffer);
    return storageKey;
  }
}

export async function deleteFile(storageKey: string): Promise<void> {
  if (PROVIDER === 's3' && s3Client) {
    const bucket = process.env.S3_BUCKET_NAME || '';
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: storageKey,
      })
    );
  } else {
    const targetPath = path.join(LOCAL_DIR, storageKey);
    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
    }
  }
}

export async function getFileBuffer(storageKey: string): Promise<Buffer> {
  if (PROVIDER === 's3' && s3Client) {
    const bucket = process.env.S3_BUCKET_NAME || '';
    const res = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: storageKey,
      })
    );
    if (!res.Body) throw new Error('File not found in S3');
    const bytes = await res.Body.transformToByteArray();
    return Buffer.from(bytes);
  } else {
    const targetPath = path.join(LOCAL_DIR, storageKey);
    if (!fs.existsSync(targetPath)) {
      throw new Error(`File not found: ${targetPath}`);
    }
    return fs.promises.readFile(targetPath);
  }
}

export async function getSignedDownloadUrl(
  storageKey: string,
  expiresSeconds: number = 3600
): Promise<string> {
  if (PROVIDER === 's3' && s3Client) {
    const bucket = process.env.S3_BUCKET_NAME || '';
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: storageKey,
    });
    return getSignedUrl(s3Client, command, { expiresIn: expiresSeconds });
  } else {
    const expires = Math.floor(Date.now() / 1000) + expiresSeconds;
    const crypto = require('crypto');
    const secret = process.env.JWT_SECRET || 'local_storage_secret';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${storageKey}:${expires}`)
      .digest('hex');
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${appUrl}/api/storage/download?key=${encodeURIComponent(
      storageKey
    )}&expires=${expires}&signature=${signature}`;
  }
}
