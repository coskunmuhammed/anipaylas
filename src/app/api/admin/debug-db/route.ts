import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const results: Record<string, any> = {};

  try {
    // Run missing DDL migrations if any column is missing
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "EventType" AS ENUM ('WEDDING', 'ENGAGEMENT', 'HENNA', 'BIRTHDAY', 'GRADUATION', 'BABY_SHOWER', 'PROMISE', 'CORPORATE', 'PARTY', 'OTHER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "SubjectType" AS ENUM ('COUPLE', 'PERSON', 'ORGANIZATION');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "DownloadLink" ADD COLUMN IF NOT EXISTS "tokenEncrypted" TEXT;
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "eventType" "EventType" NOT NULL DEFAULT 'WEDDING';
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "subjectType" "SubjectType" NOT NULL DEFAULT 'COUPLE';
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "hostName" TEXT;
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "instagramUsername" TEXT;
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Event" ALTER COLUMN "brideName" DROP NOT NULL;
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Event" ALTER COLUMN "groomName" DROP NOT NULL;
    `);

    results.migrationStatus = 'Migration executed successfully!';
  } catch (err: any) {
    results.migrationError = { message: err.message, stack: err.stack };
  }

  try {
    results.eventsCount = await prisma.event.count();
    results.eventsSample = await prisma.event.findMany({ take: 2 });
  } catch (err: any) {
    results.eventsQueryError = { message: err.message, stack: err.stack };
  }

  return NextResponse.json(results);
}
