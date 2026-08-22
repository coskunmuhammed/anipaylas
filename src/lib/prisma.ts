import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Polyfill BigInt serialization for JSON & React Server Components (RSC)
if (typeof BigInt !== 'undefined') {
  (BigInt.prototype as any).toJSON = function () {
    return Number(this);
  };
}

const connectionString = process.env.DATABASE_URL || 'postgresql://wedding_admin:wedding_password@localhost:5433/wedding_db?schema=public';

const needsSsl = process.env.NODE_ENV === 'production' || 
  !!process.env.VERCEL || 
  connectionString.includes('sslmode=') || 
  connectionString.includes('supabase') || 
  connectionString.includes('neon') ||
  connectionString.includes('cockroach');

const pool = new Pool({ 
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Auto-seed admin user and ensure database schema migrations
export async function seedAdmin() {
  try {
    // Ensure DDL columns exist
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "EventType" AS ENUM ('WEDDING', 'ENGAGEMENT', 'HENNA', 'BIRTHDAY', 'GRADUATION', 'BABY_SHOWER', 'PROMISE', 'CORPORATE', 'PARTY', 'OTHER');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN
        CREATE TYPE "SubjectType" AS ENUM ('COUPLE', 'PERSON', 'ORGANIZATION');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      ALTER TABLE "DownloadLink" ADD COLUMN IF NOT EXISTS "tokenEncrypted" TEXT;
      ALTER TABLE "Photo" ADD COLUMN IF NOT EXISTS "clientUploadId" TEXT;
      ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "eventType" "EventType" NOT NULL DEFAULT 'WEDDING';
      ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "subjectType" "SubjectType" NOT NULL DEFAULT 'COUPLE';
      ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "hostName" TEXT;
      ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "instagramUsername" TEXT;
      ALTER TABLE "Event" ALTER COLUMN "brideName" DROP NOT NULL;
      ALTER TABLE "Event" ALTER COLUMN "groomName" DROP NOT NULL;
    `).catch(() => {});

    const email = process.env.ADMIN_EMAIL || 'admin@weddingalbum.com';
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!existing) {
      const password = process.env.ADMIN_PASSWORD || 'adminpassword123';
      const name = process.env.ADMIN_NAME || 'Sistem Yöneticisi';
      const passwordHash = await bcrypt.hash(password, 10);
      
      await prisma.adminUser.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'ADMIN',
          isActive: true,
        },
      });
      console.log('Default admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

// Perform seed on initialization
seedAdmin();
