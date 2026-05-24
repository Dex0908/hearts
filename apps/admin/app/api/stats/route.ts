import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@skyhearts/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    activeOrders,
    completedOrders,
    totalClients,
    revenueAgg,
    todayOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } } }),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { price: true } }),
    prisma.order.findMany({
      where: { updatedAt: { gte: today } },
      select: { heartsDelivered: true },
    }),
  ]);

  const heartsDeliveredToday = todayOrders.reduce((sum, o) => sum + o.heartsDelivered, 0);

  return NextResponse.json({
    success: true,
    data: {
      totalOrders,
      activeOrders,
      completedOrders,
      totalClients,
      totalRevenue: Number(revenueAgg._sum.price || 0),
      heartsDeliveredToday,
      dailyCapacityUsed: Math.min((heartsDeliveredToday / 50) * 100, 100),
    },
  });
}
