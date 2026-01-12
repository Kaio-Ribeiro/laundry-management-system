import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const transfers = await prisma.transfer.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(transfers);
  } catch (error) {
    console.error('Erro ao buscar transferências:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, amount } = body;

    // Validações
    if (!from || !to || !amount) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json(
        { error: 'Origem e destino devem ser diferentes' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'O valor deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (!['PIX', 'DINHEIRO'].includes(from.toUpperCase()) || 
        !['PIX', 'DINHEIRO'].includes(to.toUpperCase())) {
      return NextResponse.json(
        { error: 'Origem e destino devem ser PIX ou DINHEIRO' },
        { status: 400 }
      );
    }

    const transfer = await prisma.transfer.create({
      data: {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: parseFloat(amount)
      }
    });

    return NextResponse.json(transfer, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar transferência:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}