// jest.setup.js

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();

global.prisma = prisma;

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Limpar as tabelas na ordem correta
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});
