import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'hearts2025';
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminHash,
    },
  });

  console.log('✅ Admin created:', admin.username);

  // Create demo user
  const userPassword = await bcrypt.hash('demo1234', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@skyhearts.app' },
    update: {},
    create: {
      email: 'demo@skyhearts.app',
      passwordHash: userPassword,
      name: 'Sky Traveler',
    },
  });

  console.log('✅ Demo user created:', user.email);

  // Create sample orders
  await prisma.order.createMany({
    data: [
      {
        userId: user.id,
        skyFriendCode: 'SKY#12345',
        hearts: 150,
        heartsDelivered: 90,
        price: 5.49,
        status: 'IN_PROGRESS',
        contactMethod: 'TELEGRAM',
        contactUsername: '@skyplayer',
        etaDays: 5,
      },
      {
        userId: user.id,
        skyFriendCode: 'SKY#12345',
        hearts: 50,
        heartsDelivered: 50,
        price: 1.99,
        status: 'COMPLETED',
        contactMethod: 'DISCORD',
        contactUsername: 'skyplayer#1234',
        etaDays: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Sample orders created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
