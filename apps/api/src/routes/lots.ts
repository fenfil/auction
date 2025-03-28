import { GetLot, GetLots } from '@repo/shared/dist/interfaces/lots';
import express from 'express';
import { NotFoundError } from '../errors';
import lotService from '../services/lot.service';
import prismaService from '../services/prisma.service';
const router = express.Router();


router.get('/', async (req, res) => {
  const lots = await prismaService.prisma.lot.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      bids: true,
    },
  });
  res.json(lots.map(lotService.cleanLot) as GetLots.Response);
});


router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const lot = await lotService.findOne(id);

  if (!lot) {
    throw new NotFoundError(`Lot with id ${id} not found`);
  }

  res.json(lotService.cleanLot(lot) as GetLot.Response);
});

export default router; 
