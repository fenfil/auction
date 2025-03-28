import prismaService from '../services/prisma.service';

beforeAll(async () => {
  await prismaService.connect();
});

afterAll(async () => {
  await prismaService.disconnect();
}); 
