import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@skyhearts/db';
import { getAdminSession } from '@/lib/auth';
import { z } from 'zod';

const UpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  heartsDelivered: z.number().int().min(0).optional(),
  message: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { status, heartsDelivered, message } = UpdateSchema.parse(body);

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(heartsDelivered !== undefined && { heartsDelivered }),
      },
    });

    // Create update log
    if (message || heartsDelivered !== undefined) {
      const heartsAdded = heartsDelivered !== undefined
        ? heartsDelivered - order.heartsDelivered
        : 0;

      await prisma.orderUpdate.create({
        data: {
          orderId: params.id,
          message: message || `Hearts updated: ${heartsDelivered}/${order.hearts}`,
          heartsAdded: Math.max(0, heartsAdded),
        },
      });

      // Create user notification
      await prisma.notification.create({
        data: {
          userId: order.userId,
          title: 'Order Update',
          message: message || `Your order has been updated. ${heartsDelivered}/${order.hearts} hearts delivered.`,
        },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
