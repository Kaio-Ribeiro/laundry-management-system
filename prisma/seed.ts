import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@laundry.com' },
    update: {},
    create: {
      email: 'admin@laundry.com',
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
        description: 'Complete washing and drying service',
        price: 5.00,
      },
      {
        name: 'Dry Cleaning',
        description: 'Professional dry cleaning service',
        price: 15.00,
      },
      {
        name: 'Iron Only',
        description: 'Ironing service for clean clothes',
        price: 3.00,
      },
      {
        name: 'Wash Only',
        description: 'Washing service without drying',
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