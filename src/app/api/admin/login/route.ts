import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { encryptSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir.' }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Geçersiz giriş bilgileri.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Geçersiz giriş bilgileri.' }, { status: 401 });
    }

    // Create session
    const token = await encryptSession({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: 'LOGIN',
        entityType: 'AdminUser',
        entityId: admin.id,
      },
    });

    const response = NextResponse.json({ success: true, user: { name: admin.name, email: admin.email } });

    // Set cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
