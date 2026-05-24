import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@skyhearts/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, email: true, name: true, telegramId: true } },
      updates: { orderBy: { createdAt: 'desc' }, take: 3 },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: orders });
}
