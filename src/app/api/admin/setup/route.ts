import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST - Rota temporária para cadastrar usuário admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
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

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
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
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'ADMIN', // Forçar role como ADMIN
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
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
    instructions: 'POST com { "name": "Nome", "email": "email@domain.com", "password": "senha123" }'
  });
}