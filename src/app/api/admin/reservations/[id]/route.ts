import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Güncellenecek durum bilgisi eksik.' }, { status: 400 });
    }

    const updated = await prisma.reservationRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ success: false, error: error.message || 'Güncellenemedi.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.reservationRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Rezervasyon talebi silindi.' });
  } catch (error: any) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json({ success: false, error: error.message || 'Silinemedi.' }, { status: 500 });
  }
}
