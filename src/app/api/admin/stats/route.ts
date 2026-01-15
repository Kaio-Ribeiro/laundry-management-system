import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [activeOrders, revenueAgg, newCustomers, totalCustomers] = await Promise.all([
      prisma.order.count({ where: { status: { not: 'COMPLETED' } } }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.customer.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.customer.count(),
    ]);

    const revenueToday = revenueAgg._sum.totalPrice ?? 0;

    return NextResponse.json({
      activeOrders,
      revenueToday,
      newCustomers,
      totalCustomers,
    });
  } catch (error) {
    console.error('Failed to get admin stats', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
