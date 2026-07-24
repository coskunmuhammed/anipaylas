import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { saveFile } from '@/lib/storage';
import { normalizeInstagramUsername, getEventDisplayName, getDefaultSubjectType } from '@/lib/eventUtils';
import { EventType, SubjectType, EventStatus } from '@prisma/client';
import crypto from 'crypto';
import path from 'path';

// Helper to generate slug
function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
  };
  let cleanText = text;
  Object.keys(trMap).forEach((key) => {
    cleanText = cleanText.replace(new RegExp(key, 'g'), trMap[key]);
  });
  
  return cleanText
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Generate secure random short code
function generateShortCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const eventType = (formData.get('eventType') as EventType) || 'WEDDING';
    const subjectType = (formData.get('subjectType') as SubjectType) || getDefaultSubjectType(eventType);
    
    const brideName = formData.get('brideName') as string | null;
    const groomName = formData.get('groomName') as string | null;
    const hostName = formData.get('hostName') as string | null;
    const rawInstagram = formData.get('instagramUsername') as string | null;
    const instagramUsername = normalizeInstagramUsername(rawInstagram);

    const eventDateStr = formData.get('eventDate') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const venueName = formData.get('venueName') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;
    const welcomeTitle = formData.get('welcomeTitle') as string;
    const welcomeMessage = formData.get('welcomeMessage') as string;
    const theme = formData.get('theme') as string;
    const status = (formData.get('status') as EventStatus) || 'ACTIVE';
    
    const moderationEnabled = formData.get('moderationEnabled') === 'true';
    const guestNameRequired = formData.get('guestNameRequired') === 'true';
    const guestMessageEnabled = formData.get('guestMessageEnabled') === 'true';
    
    const uploadStartsAtStr = formData.get('uploadStartsAt') as string;
    const uploadEndsAtStr = formData.get('uploadEndsAt') as string;
    
    const maxPhotosPerGuest = parseInt(formData.get('maxPhotosPerGuest') as string, 10);
    const maxPhotoSizeBytes = parseInt(formData.get('maxPhotoSizeBytes') as string, 10);
    const maxTotalPhotos = parseInt(formData.get('maxTotalPhotos') as string, 10);
    const maxStorageBytes = BigInt(formData.get('maxStorageBytes') as string || '10737418240');

    const coverImageFile = formData.get('coverImage') as File | null;

    if (!title || !eventDateStr || !venueName || !city || !district) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksiktir.' }, { status: 400 });
    }

    // Backend validation strictly based on active subjectType
    if (subjectType === 'COUPLE') {
      if (!brideName?.trim() || !groomName?.trim()) {
        return NextResponse.json({ error: 'Gelin ve Damat adları zorunludur.' }, { status: 400 });
      }
    } else {
      if (!hostName?.trim()) {
        return NextResponse.json({ error: 'Etkinlik sahibi / organizasyon adı zorunludur.' }, { status: 400 });
      }
    }

    // Generate unique short code
    let shortCode = '';
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      shortCode = generateShortCode();
      const existing = await prisma.event.findUnique({ where: { shortCode } });
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ error: 'Etkinlik kısa kodu oluşturulamadı.' }, { status: 500 });
    }

    // Generate unique slug
    const displayName = getEventDisplayName({ eventType, subjectType, brideName, groomName, hostName, title });
    let baseSlug = slugify(displayName || title);
    if (!baseSlug) baseSlug = 'event';
    let slug = baseSlug;
    isUnique = false;
    attempts = 0;
    while (!isUnique && attempts < 10) {
      const existing = await prisma.event.findUnique({ where: { slug } });
      if (!existing) {
        isUnique = true;
      } else {
        slug = `${baseSlug}-${crypto.randomInt(1000, 9999)}`;
      }
      attempts++;
    }

    // Process cover image
    let coverImageUrl = '';
    if (coverImageFile && coverImageFile.size > 0) {
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      const ext = path.extname(coverImageFile.name) || '.jpg';
      const key = `covers/${slug}-${Date.now()}${ext}`;
      coverImageUrl = await saveFile(buffer, key, coverImageFile.type);
    }

    // Safe date parsers
    const eventDate = new Date(eventDateStr);
    const fallbackStart = !isNaN(eventDate.getTime()) ? eventDate : new Date();
    const fallbackEnd = new Date(fallbackStart.getTime() + 24 * 60 * 60 * 1000);

    const uploadStartsAt = uploadStartsAtStr && !isNaN(new Date(uploadStartsAtStr).getTime())
      ? new Date(uploadStartsAtStr)
      : fallbackStart;

    const uploadEndsAt = uploadEndsAtStr && !isNaN(new Date(uploadEndsAtStr).getTime())
      ? new Date(uploadEndsAtStr)
      : fallbackEnd;

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        shortCode,
        eventType,
        subjectType,
        brideName: brideName?.trim() || null,
        groomName: groomName?.trim() || null,
        hostName: hostName?.trim() || null,
        instagramUsername,
        eventDate,
        startTime,
        endTime,
        venueName,
        city,
        district,
        welcomeTitle,
        welcomeMessage,
        theme,
        status,
        uploadStartsAt,
        uploadEndsAt,
        moderationEnabled,
        guestNameRequired,
        guestMessageEnabled,
        maxPhotosPerGuest,
        maxPhotoSizeBytes,
        maxTotalPhotos,
        maxStorageBytes,
        coverImageUrl: coverImageUrl || null,
      },
    });

    // Write audit log (without sensitive tokens)
    await prisma.auditLog.create({
      data: {
        adminUserId: adminSession.userId,
        action: 'CREATE_EVENT',
        entityType: 'Event',
        entityId: event.id,
        metadata: JSON.stringify({ title, shortCode, eventType, subjectType }),
      },
    });

    return NextResponse.json({
      success: true,
      eventId: event.id,
      event: {
        id: event.id,
        title: event.title,
        shortCode: event.shortCode,
        slug: event.slug,
        eventType: event.eventType,
        subjectType: event.subjectType,
        brideName: event.brideName,
        groomName: event.groomName,
        hostName: event.hostName,
        instagramUsername: event.instagramUsername,
        eventDate: event.eventDate.toISOString(),
        startTime: event.startTime,
        endTime: event.endTime,
        venueName: event.venueName,
        city: event.city,
        district: event.district,
        coverImageUrl: event.coverImageUrl,
        theme: event.theme,
        status: event.status,
      },
    });
  } catch (error: unknown) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
