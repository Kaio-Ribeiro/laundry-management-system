import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { username: session.user.username } });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [ordersToday, pendingOrders, totalCustomers, salesAgg] = await Promise.all([
      prisma.order.count({ where: { sellerId: user.id, createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { sellerId: user.id, status: 'PENDING' } }),
      prisma.customer.count(),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { sellerId: user.id, createdAt: { gte: startOfToday } },
      }),
    ]);

    const salesToday = salesAgg._sum.totalPrice ?? 0;

    return NextResponse.json({ ordersToday, pendingOrders, totalCustomers, salesToday });
  } catch (error) {
    console.error('Erro ao buscar stats do vendedor:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
