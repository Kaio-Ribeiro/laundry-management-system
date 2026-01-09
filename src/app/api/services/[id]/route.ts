import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
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
    const { name, price, commission, isActive } = body;

    // Verificar se o serviço existe
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
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

    if (price !== undefined && price < 0) {
      return NextResponse.json(
        { error: 'Preço deve ser maior ou igual a zero' },
        { status: 400 }
      );
    }

    if (commission !== undefined && commission < 0) {
      return NextResponse.json(
        { error: 'Comissão deve ser maior ou igual a zero' },
        { status: 400 }
      );
    }

    // Verificar se já existe outro serviço com o mesmo nome
    if (name && name !== existingService.name) {
      const duplicateService = await prisma.service.findFirst({
        where: {
          name: name,
          NOT: { id }
        }
      });

      if (duplicateService) {
        return NextResponse.json(
          { error: 'Já existe um serviço com este nome' },
          { status: 400 }
        );
      }
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(commission !== undefined && { commission: parseFloat(commission) }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
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

    // Verificar se o serviço existe
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Exclusão real
    await prisma.service.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Serviço excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}