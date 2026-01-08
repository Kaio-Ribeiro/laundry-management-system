import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST - Rota temporária para cadastrar usuário admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, username, password } = body;

    // Validações básicas
    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'Nome, username e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar username (mínimo 3 caracteres, sem espaços)
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username deve ter pelo menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (/\s/.test(username)) {
      return NextResponse.json(
        { error: 'Username não pode conter espaços' },
        { status: 400 }
      );
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se o banco está acessível
    try {
      await prisma.$connect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          error: 'Erro de conexão com banco de dados',
          details: 'Verifique se as migrações foram executadas'
        },
        { status: 503 }
      );
    }

    // Verificar se o username já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username já cadastrado' },
        { status: 409 }
      );
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar o usuário admin
    const newAdmin = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase(),
        password: hashedPassword,
        role: 'ADMIN', // Forçar role como ADMIN
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Usuário admin criado com sucesso',
        admin: newAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    
    // Tratamento específico para erro de banco readonly
    if (error instanceof Error && error.message.includes('readonly database')) {
      return NextResponse.json(
        { 
          error: 'Banco de dados em modo somente leitura',
          solution: 'Execute as migrações: npx prisma migrate deploy'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - Verificar se a rota está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'Rota temporária para criação de admin ativa',
    warning: 'Esta rota será removida em produção',
    instructions: 'POST com { "name": "Nome", "username": "admin", "password": "senha123" }'
  });
}