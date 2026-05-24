import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@skyhearts/db';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: session.userId },
    include: { updates: { orderBy: { createdAt: 'desc' } } },
  });

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true, data: order });
}
