import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { names, phone, date, city, selectedService, selectedConcept, notes } = body;

    if (!names || !phone || !selectedService) {
      return NextResponse.json({ success: false, error: 'Lütfen ad soyad, telefon ve hizmet seçimi alanlarını doldurun.' }, { status: 400 });
    }

    const reservation = await prisma.reservationRequest.create({
      data: {
        coupleNames: names,
        phone: phone,
        eventDate: date || null,
        city: city || null,
        selectedService: selectedService,
        selectedConcept: selectedConcept || null,
        notes: notes || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      data: reservation,
      message: 'Rezervasyon talebiniz başarıyla alındı.',
    });
  } catch (error: any) {
    console.error('Error saving reservation request:', error);
    return NextResponse.json({ success: false, error: error.message || 'Rezervasyon kaydedilirken sunucu hatası oluştu.' }, { status: 500 });
  }
}
