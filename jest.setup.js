// jest.setup.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config({ path: '.env.test' });

global.prisma = prisma;

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Limpar as tabelas antes de cada teste
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
});
