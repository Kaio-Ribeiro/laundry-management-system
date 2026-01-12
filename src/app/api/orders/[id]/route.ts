import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
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
      const { customerId, orderItems, notes, status, paymentMethod, discount } = body;

    // Verificar se o pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Se veio orderItems, substituímos os itens atuais pelo novo conjunto e recalculamos totalPrice
    let newTotalPrice = existingOrder.totalPrice;
    if (orderItems) {
      if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return NextResponse.json({ error: 'orderItems inválido' }, { status: 400 });
      }

      // Validar e calcular
      const itemsToCreate: Array<{ serviceId: string; quantity: number; price: number; subtotal: number }> = [];
      let acc = 0;
      for (const it of orderItems) {
        const { serviceId, quantity } = it as { serviceId?: string; quantity?: number };
        if (!serviceId || !quantity || quantity < 1) {
          return NextResponse.json({ error: 'Dados inválidos em orderItems' }, { status: 400 });
        }

        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service || !service.isActive) {
          return NextResponse.json({ error: `Serviço ${serviceId} não encontrado ou inativo` }, { status: 404 });
        }

        const subtotal = service.price * quantity;
        acc += subtotal;
        itemsToCreate.push({ serviceId, quantity, price: service.price, subtotal });
      }

      newTotalPrice = acc;

      // Substituir itens antigos por novos
      await prisma.orderItem.deleteMany({ where: { orderId } });
      // createMany is faster but doesn't support nested writes with relations here; use createMany
      await prisma.orderItem.createMany({
        data: itemsToCreate.map(i => ({
          orderId,
          serviceId: i.serviceId,
          quantity: i.quantity,
          price: i.price,
          subtotal: i.subtotal,
        })),
      });
    }

    // Apply discount if provided and compute final total
    const discountNumber = Number(discount) || 0;
    const finalTotalPrice = Math.max(0, newTotalPrice - discountNumber);

    // Atualizar o pedido
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(customerId && { customerId }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        totalPrice: finalTotalPrice,
        paymentMethod: paymentMethod ?? undefined,
        discount: discountNumber,
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