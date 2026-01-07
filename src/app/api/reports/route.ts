import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';

interface MonthlyRevenueResult {
  month: string;
  orders: number;
  revenue: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    // Construir filtros
    const where: Prisma.OrderWhereInput = {};
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(`${startDate}T00:00:00.000Z`),
        lte: new Date(`${endDate}T23:59:59.999Z`)
      };
    } else if (startDate) {
      where.createdAt = {
        gte: new Date(`${startDate}T00:00:00.000Z`)
      };
    } else if (endDate) {
      where.createdAt = {
        lte: new Date(`${endDate}T23:59:59.999Z`)
      };
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Buscar pedidos com items e serviços
    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        orderItems: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular estatísticas
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.orderItems.reduce((itemSum, item) => {
        return itemSum + (item.service.price * item.quantity);
      }, 0);
      return sum + orderTotal;
    }, 0);

    // Pedidos por status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: startDate && endDate ? {
        createdAt: {
          gte: new Date(`${startDate}T00:00:00.000Z`),
          lte: new Date(`${endDate}T23:59:59.999Z`)
        }
      } : startDate ? {
        createdAt: {
          gte: new Date(`${startDate}T00:00:00.000Z`)
        }
      } : endDate ? {
        createdAt: {
          lte: new Date(`${endDate}T23:59:59.999Z`)
        }
      } : undefined,
      _count: {
        status: true
      }
    });

    // Serviços mais solicitados
    const serviceStats = await prisma.orderItem.groupBy({
      by: ['serviceId'],
      where: {
        order: startDate && endDate ? {
          createdAt: {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${endDate}T23:59:59.999Z`)
          }
        } : startDate ? {
          createdAt: {
            gte: new Date(`${startDate}T00:00:00.000Z`)
          }
        } : endDate ? {
          createdAt: {
            lte: new Date(`${endDate}T23:59:59.999Z`)
          }
        } : undefined
      },
      _sum: {
        quantity: true
      },
      _count: {
        serviceId: true
      }
    });

    // Buscar nomes dos serviços
    const serviceIds = serviceStats.map(stat => stat.serviceId);
    const services = await prisma.service.findMany({
      where: {
        id: {
          in: serviceIds
        }
      }
    });

    const topServices = serviceStats.map(stat => {
      const service = services.find(s => s.id === stat.serviceId);
      return {
        service: service?.name || 'Serviço não encontrado',
        quantity: stat._sum.quantity || 0,
        orders: stat._count.serviceId
      };
    }).sort((a, b) => b.quantity - a.quantity);

    // Receita por mês (últimos 6 meses se não especificado)
    const monthlyRevenue = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as orders,
        SUM(
          (SELECT SUM(s.price * oi.quantity) 
           FROM order_items oi 
           JOIN services s ON oi.serviceId = s.id 
           WHERE oi.orderId = o.id)
        ) as revenue
      FROM orders o
      WHERE 
        ${startDate && endDate ? `createdAt >= '${startDate} 00:00:00' AND createdAt <= '${endDate} 23:59:59'` : startDate ? `createdAt >= '${startDate} 00:00:00'` : endDate ? `createdAt <= '${endDate} 23:59:59'` : `createdAt >= datetime('now', '-6 months')`}
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month DESC
      LIMIT 12
    ` as MonthlyRevenueResult[];

    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue,
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {} as Record<string, number>)
      },
      orders,
      topServices: topServices.slice(0, 10),
      monthlyRevenue
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}