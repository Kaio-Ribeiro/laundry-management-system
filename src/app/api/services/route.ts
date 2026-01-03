import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, commission } = body;

    // Validações
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Nome e preço são obrigatórios' },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: 'Preço deve ser maior ou igual a zero' },
        { status: 400 }
      );
    }

    if (commission !== undefined && commission !== null && commission < 0) {
      return NextResponse.json(
        { error: 'Comissão deve ser maior ou igual a zero' },
        { status: 400 }
      );
    }

    // Verificar se já existe um serviço com o mesmo nome
    const existingService = await prisma.service.findFirst({
      where: {
        name: name
      }
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'Já existe um serviço com este nome' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        commission: commission ? parseFloat(commission) : 0,
        isActive: true
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}