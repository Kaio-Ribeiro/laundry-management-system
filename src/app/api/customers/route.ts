import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, address } = body;

    // Validações
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe um cliente com o mesmo telefone
    const existingCustomerByPhone = await prisma.customer.findFirst({
      where: {
        phone: phone
      }
    });

    if (existingCustomerByPhone) {
      return NextResponse.json(
        { error: 'Já existe um cliente com este telefone' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        address: address || '',
        isActive: true
      }
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}