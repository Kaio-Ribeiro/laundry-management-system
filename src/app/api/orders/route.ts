import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth-options';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        orderItems: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar o usuário logado
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { customerId, serviceId, quantity, notes, status = 'PENDING' } = body;

    // Validar dados obrigatórios
    if (!customerId || !serviceId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Verificar se o cliente existe
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Verificar se o serviço existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.isActive) {
      return NextResponse.json({ error: 'Serviço não encontrado ou inativo' }, { status: 404 });
    }

    // Calcular subtotal
    const subtotal = service.price * quantity;

    // Criar o pedido
    const order = await prisma.order.create({
      data: {
        customerId,
        sellerId: user.id,
        status,
        totalPrice: subtotal,
        notes,
        orderItems: {
          create: {
            serviceId,
            quantity,
            price: service.price,
            subtotal,
          },
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        orderItems: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}