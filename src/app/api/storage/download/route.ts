import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getStorageDir } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const expiresStr = searchParams.get('expires');
    const signature = searchParams.get('signature');

    if (!key || !expiresStr || !signature) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const expires = parseInt(expiresStr, 10);
    const now = Math.floor(Date.now() / 1000);
    if (now > expires) {
      return NextResponse.json({ error: 'URL has expired' }, { status: 401 });
    }

    // Verify signature
    const secret = process.env.JWT_SECRET || 'local_storage_secret';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${key}:${expires}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Resolve file path safely
    const localDir = getStorageDir();
    const filePath = path.join(localDir, key);

    // Prevent path traversal
    const resolvedPath = path.resolve(filePath);
    const resolvedStorageDir = path.resolve(localDir);
    if (!resolvedPath.startsWith(resolvedStorageDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stat = fs.statSync(resolvedPath);
    const fileBuffer = fs.readFileSync(resolvedPath);

    // Guess Content-Type
    let contentType = 'application/octet-stream';
    if (key.endsWith('.jpg') || key.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (key.endsWith('.png')) contentType = 'image/png';
    else if (key.endsWith('.webp')) contentType = 'image/webp';
    else if (key.endsWith('.zip')) contentType = 'application/zip';
    else if (key.endsWith('.csv')) contentType = 'text/csv';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Content-Disposition': `inline; filename="${path.basename(key)}"`,
      },
    });
  } catch (error: any) {
    console.error('Error serving storage file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
