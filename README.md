# Laundry Management System

Sistema completo de gerenciamento para lavanderia com controle de usuários, clientes, serviços e pedidos.

## Funcionalidades

- **Controle de Usuários**: Admin e Vendedores com diferentes permissões
- **Gestão de Clientes**: Cadastro e gerenciamento de clientes
- **Catálogo de Serviços**: CRUD completo para serviços de lavanderia
- **Sistema de Pedidos**: Processamento completo de pedidos
- **Relatórios**: Analytics e relatórios para administradores
- **Autenticação Segura**: Sistema de login protegido

## Tecnologias

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **UI**: Radix UI, Lucide Icons
- **Deploy**: Docker & Docker Compose

## Como Rodar

### Desenvolvimento

1. **Clone o projeto**
```bash
git clone <repository-url>
cd laundry-management-system
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco PostgreSQL**
```bash
npm run docker:up  # Sobe PostgreSQL no Docker
```

4. **Configure o banco e popule com dados**
```bash
npm run db:push
npm run db:seed
```

5. **Inicie o servidor**
```bash
npm run dev
```

6. **Acesse** [http://localhost:3000](http://localhost:3000)

### Credenciais Padrão

- **Login**: admin
- **Senha**: admin123

### Produção

1. **Configure variáveis de ambiente**
2. **Execute o deploy**
```bash
npm run prod
```

## Scripts Principais

- `npm run dev` - Servidor de desenvolvimento
- `npm run prod` - Deploy em produção
- `npm run docker:up` - Subir PostgreSQL
- `npm run db:studio` - Abrir Prisma Studio
