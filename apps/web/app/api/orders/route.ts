import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@skyhearts/db';
import { calculatePrice, calculateETA } from '@skyhearts/shared';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  hearts: z.number().int().min(1).max(9999),
  skyFriendCode: z.string().min(2).max(100),
  contactMethod: z.enum(['TELEGRAM', 'DISCORD', 'INSTAGRAM', 'TIKTOK', 'TWITTER']),
  contactUsername: z.string().min(2).max(100),
  notes: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const session = await getSession(req.headers.get('cookie'));
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { updates: { orderBy: { createdAt: 'desc' }, take: 5 } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: orders });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req.headers.get('cookie'));
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { hearts, skyFriendCode, contactMethod, contactUsername, notes } =
      CreateOrderSchema.parse(body);

    const price = calculatePrice(hearts);
    const etaDays = calculateETA(hearts);

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        hearts,
        skyFriendCode,
        contactMethod,
        contactUsername,
        notes,
        price,
        etaDays,
        status: 'PENDING',
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.userId,
        title: 'Order Placed!',
        message: `Your order of ${hearts} hearts has been placed. ETA: ~${etaDays} days.`,
      },
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
