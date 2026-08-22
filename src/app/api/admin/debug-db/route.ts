import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const diagnostics: Record<string, any> = {};

  try {
    diagnostics.auditLogCount = await prisma.auditLog.count();
  } catch (e: any) {
    diagnostics.auditLogError = { message: e.message, stack: e.stack, code: e.code };
  }

  try {
    diagnostics.eventCount = await prisma.event.count();
  } catch (e: any) {
    diagnostics.eventError = { message: e.message, stack: e.stack, code: e.code };
  }

  try {
    diagnostics.eventsSample = await prisma.event.findMany({ take: 2 });
  } catch (e: any) {
    diagnostics.eventsSampleError = { message: e.message, stack: e.stack, code: e.code };
  }

  try {
    diagnostics.photoCount = await prisma.photo.count();
  } catch (e: any) {
    diagnostics.photoError = { message: e.message, stack: e.stack, code: e.code };
  }

  try {
    diagnostics.downloadLinkCount = await prisma.downloadLink.count();
  } catch (e: any) {
    diagnostics.downloadLinkError = { message: e.message, stack: e.stack, code: e.code };
  }

  return NextResponse.json(diagnostics);
}
