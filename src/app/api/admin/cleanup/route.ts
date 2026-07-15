import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { runSystemCleanup } from '@/lib/cleanup';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdmin();

    const result = await runSystemCleanup();

    // Log the cleanup action in audit logs
    await prisma.auditLog.create({
      data: {
        adminUserId: adminSession.userId,
        action: 'RUN_SYSTEM_CLEANUP',
        entityType: 'System',
        metadata: JSON.stringify(result),
      },
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Temizlik hatası oluştu.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, reports: result.reports });
  } catch (error: any) {
    console.error('Error triggering cleanup API:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
