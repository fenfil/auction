import { LotStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {

  const now = new Date();

  const lots = [
    {
      title: 'Vintage Camera',
      startingPrice: 50,
      currentPrice: 50,
      status: LotStatus.OPEN,
      startTime: now,
      endTime: new Date(now.getTime() + 3 * 60 * 1000),
    },
    {
      title: 'Antique Pocket Watch',
      startingPrice: 120,
      currentPrice: 120,
      status: LotStatus.OPEN,
      startTime: now,
      endTime: new Date(now.getTime() + 5 * 60 * 1000),
    },
  ];

  for (const lot of lots) {
    await prisma.lot.create({
      data: lot,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
