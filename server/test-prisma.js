require('dotenv').config();
try {
  const { PrismaClient } = require('@prisma/client');
  
//   const { PrismaClient } = require('./src/generated/default');
//   const { PrismaClient } = require('./src/generated');
  
  console.log('@prisma/client required ok');
  const prisma = new PrismaClient();
  (async () => {
    try {
      await prisma.$connect();
      console.log('Prisma connected');
      await prisma.$disconnect();
      process.exit(0);
    } catch (e) {
      console.error('Prisma connect error:', e);
      process.exit(1);
    }
  })();
} catch (e) {
  console.error('Require @prisma/client failed:', e);
  process.exit(1);
}
