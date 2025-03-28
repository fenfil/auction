import { Bid as CleanBid, LotStatus, PlaceBid } from '@repo/shared/dist/interfaces/lots';
import { BadRequestError } from '../errors';
import prismaService from './prisma.service';
import { Bid } from '@prisma/client';

class BidService {
  async findByLotId(lotId: number) {
    return prismaService.prisma.bid.findMany({
      where: { lotId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async placeBid(lotId: number, userId: string, bidDto: PlaceBid.Request) {
    const lot = await prismaService.prisma.lot.findUnique({
      where: { id: lotId },
    });

    if (!lot) {
      throw new BadRequestError('Lot not found');
    }

    if (lot.status !== LotStatus.OPEN) {
      throw new BadRequestError('Lot is closed');
    }

    const now = new Date();
    if (lot.endTime <= now) {
      throw new BadRequestError('Lot has expired');
    }

    if (bidDto.amount <= lot.currentPrice) {
      throw new BadRequestError('Bid amount must be higher than current price');
    }

    return prismaService.prisma.$transaction(async (tx) => {

      const affected = await tx.lot.updateMany({
        where: { id: lotId, endTime: { gt: new Date() } },
        data: {
          currentPrice: bidDto.amount,
        },
      });

      if (!affected.count) {
        throw new BadRequestError('Lot has expired');
      }

      const bid = await tx.bid.create({
        data: {
          amount: bidDto.amount,
          lotId,
          userId,
        },
      });

      return bid;
    });
  }

  cleanBid(bid: Bid): CleanBid {
    return {
      ...bid,
      createdAt: bid.createdAt.toISOString(),
    };
  }
}

export default new BidService(); 
