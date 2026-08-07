import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { coupleNames: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { selectedService: { contains: search, mode: 'insensitive' } },
        { selectedConcept: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, totalCount, pendingCount, contactedCount, confirmedCount] = await Promise.all([
      prisma.reservationRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reservationRequest.count(),
      prisma.reservationRequest.count({ where: { status: 'PENDING' } }),
      prisma.reservationRequest.count({ where: { status: 'CONTACTED' } }),
      prisma.reservationRequest.count({ where: { status: 'CONFIRMED' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      stats: {
        total: totalCount,
        pending: pendingCount,
        contacted: contactedCount,
        confirmed: confirmedCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin reservations:', error);
    return NextResponse.json({ success: false, error: error.message || 'Rezervasyonlar alınamadı.' }, { status: 500 });
  }
}
