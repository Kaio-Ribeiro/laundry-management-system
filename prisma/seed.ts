import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create some sample services
  await prisma.service.createMany({
    data: [
      {
        name: 'Wash & Dry',
        price: 5.00,
      },
      {
        name: 'Dry Cleaning',
        price: 15.00,
      },
      {
        name: 'Iron Only',
        price: 3.00,
      },
      {
        name: 'Wash Only',
        price: 3.50,
      },
    ],
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });