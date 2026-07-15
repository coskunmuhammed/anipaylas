import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'wedding_secret_token_123456_super_secure_key!';

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
}

export async function encryptSession(session: AdminSession): Promise<string> {
  return jwt.sign(session, JWT_SECRET, { expiresIn: '1d' });
}

export async function decryptSession(token: string): Promise<AdminSession | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSession;
    return decoded;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return decryptSession(token);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  // Double check if admin is active
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.userId },
  });
  if (!admin || !admin.isActive) {
    throw new Error('Unauthorized');
  }
  return session;
}
