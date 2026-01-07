import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                service: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, address, isActive } = body;

    // Verificar se o cliente existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Validações
    if (name && name.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    if (phone && phone.trim() === '') {
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se já existe outro cliente com o mesmo email
    if (email && email !== existingCustomer.email) {
      const duplicateCustomer = await prisma.customer.findFirst({
        where: {
          email: email,
          NOT: { id }
        }
      });

      if (duplicateCustomer) {
        return NextResponse.json(
          { error: 'Já existe um cliente com este e-mail' },
          { status: 400 }
        );
      }
    }

    // Verificar se já existe outro cliente com o mesmo telefone
    if (phone && phone !== existingCustomer.phone) {
      const duplicateCustomer = await prisma.customer.findFirst({
        where: {
          phone: phone,
          NOT: { id }
        }
      });

      if (duplicateCustomer) {
        return NextResponse.json(
          { error: 'Já existe um cliente com este telefone' },
          { status: 400 }
        );
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email: email || null }),
        ...(phone && { phone }),
        ...(address !== undefined && { address }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se o cliente existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Exclusão real do cliente
    await prisma.customer.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Cliente excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}