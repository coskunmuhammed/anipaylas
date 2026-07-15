import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL || 'postgresql://wedding_admin:wedding_password@localhost:5433/wedding_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Auto-seed admin user
export async function seedAdmin() {
  try {
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
