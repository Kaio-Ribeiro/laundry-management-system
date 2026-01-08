import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-options';
import { prisma } from '../../../../lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: orderId } = await params;
    const body = await request.json();
    const { customerId, serviceId, quantity, notes, status } = body;

    // Verificar se o pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Se está atualizando serviço ou quantidade, precisamos recalcular
    let newTotalPrice = existingOrder.totalPrice;
    
    if (serviceId || quantity) {
      // Buscar o serviço (pode ser o mesmo ou um novo)
      const currentServiceId = serviceId || existingOrder.orderItems[0]?.serviceId;
      const currentQuantity = quantity || existingOrder.orderItems[0]?.quantity;
      
      if (currentServiceId) {
        const service = await prisma.service.findUnique({
          where: { id: currentServiceId },
        });

        if (!service || !service.isActive) {
          return NextResponse.json({ error: 'Serviço não encontrado ou inativo' }, { status: 404 });
        }

        newTotalPrice = service.price * currentQuantity;

        // Atualizar o item do pedido
        await prisma.orderItem.updateMany({
          where: { orderId },
          data: {
            serviceId: currentServiceId,
            quantity: currentQuantity,
            price: service.price,
            subtotal: newTotalPrice,
          },
        });
      }
    }

    // Atualizar o pedido
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(customerId && { customerId }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        totalPrice: newTotalPrice,
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

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: orderId } = await params;

    // Verificar se o pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Deletar o pedido (os orderItems serão deletados automaticamente devido ao onDelete: Cascade)
    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}