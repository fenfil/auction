import { Bid, Lot, LotStatus } from '@prisma/client';
import { GetLot, LotStatus as LotStatusEnum } from '@repo/shared/dist/interfaces/lots';
import prismaService from './prisma.service';
import { socketService } from './socket.service';
import bidService from './bid.service';

class LotService {
  async findOne(id: number) {
    return prismaService.prisma.lot.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { createdAt: 'desc' },
        },
        finalBid: { include: { user: true } },
      },
    });
  }

  async closeLot(id: number) {
    return prismaService.prisma.$transaction(async (tx) => {
      const bid = await tx.bid.findFirst({
        where: { lotId: id },
        orderBy: { id: 'desc' },
      });

      await tx.lot.update({
        where: { id },
        data: {
          status: LotStatus.CLOSED,
          finalBidId: bid?.id,
        },
      });
    });
  }

  async checkLotClosure() {
    const now = new Date();
    const expiredLots = await prismaService.prisma.lot.findMany({
      where: {
        status: LotStatus.OPEN,
        endTime: {
          lte: now,
        },
      },
      include: {
        finalBid: { include: { user: true } },
      },
    });

    for (const lot of expiredLots) {
      await this.closeLot(lot.id);
      socketService.lotChanged(this.cleanLot(await this.findOne(lot.id)));
    }

    return expiredLots;
  }

  cleanLot(lot: Lot & { bids?: Bid[], finalBid?: (Bid & { user: { id: string, name: string } }) }): GetLot.Response {
    return {
      ...lot,
      status: lot.status as LotStatusEnum,
      startTime: lot.startTime.toISOString(),
      endTime: lot.endTime.toISOString(),
      createdAt: lot.createdAt.toISOString(),
      bids: lot.bids?.map((bid) => bidService.cleanBid(bid)),
      finalBid: lot.finalBid ? {
        ...bidService.cleanBid(lot.finalBid),
        user: {
          id: lot.finalBid.user.id,
          name: lot.finalBid.user.name,
        }
      } : undefined,
    };
  }
}


export function initLotClosureCheck(): NodeJS.Timeout {
  console.log('Initializing lot closure check to run every 30 seconds');

  const lotService = new LotService();
  lotService.checkLotClosure()
    .then(closedLots => {
      if (closedLots.length > 0) {
        console.log(`Closed ${closedLots.length} expired lots on startup`);
      }
    })
    .catch(err => console.error('Error checking lot closures on startup:', err));


  return setInterval(() => {
    lotService.checkLotClosure()
      .then(closedLots => {
        if (closedLots.length > 0) {
          console.log(`Closed ${closedLots.length} expired lots`);
        }
      })
      .catch(err => console.error('Error checking lot closures:', err));
  }, 5000);
}

export default new LotService(); 
