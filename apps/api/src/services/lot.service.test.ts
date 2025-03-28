import { LotStatus } from '@prisma/client';
import prismaService from './prisma.service';
import lotService from './lot.service';

// Mock the socket service
jest.mock('./socket.service', () => ({
  socketService: {
    lotChanged: jest.fn(),
  }
}));

describe('LotService', () => {
  describe('checkLotClosure', () => {
    beforeEach(async () => {
      // Clean up all test data before each test
      await prismaService.prisma.bid.deleteMany();
      await prismaService.prisma.lot.deleteMany();
      await prismaService.prisma.user.deleteMany();

      // Clear all mock calls before each test
      jest.clearAllMocks();
    });

    it('should close lots that have reached their end time', async () => {
      // Create a test user
      const user = await prismaService.prisma.user.create({
        data: {
          id: 'test-user-1',
          name: 'Test User',
          passwordHash: 'hash',
          role: 'user',
        }
      });

      // Create an expired lot (end time in the past)
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 10); // 10 minutes ago

      const expiredLot = await prismaService.prisma.lot.create({
        data: {
          title: 'Expired Lot',
          startingPrice: 100,
          currentPrice: 100,
          status: LotStatus.OPEN,
          startTime: new Date(pastDate.getTime() - 3600000), // 1 hour before endTime
          endTime: pastDate,
        }
      });

      // Create a bid for the expired lot
      const bid = await prismaService.prisma.bid.create({
        data: {
          lotId: expiredLot.id,
          userId: user.id,
          amount: 150,
        }
      });

      // Create an active lot (end time in the future)
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 30); // 30 minutes from now

      const activeLot = await prismaService.prisma.lot.create({
        data: {
          title: 'Active Lot',
          startingPrice: 200,
          currentPrice: 200,
          status: LotStatus.OPEN,
          startTime: new Date(),
          endTime: futureDate,
        }
      });

      // Run the check lot closure method
      const closedLots = await lotService.checkLotClosure();

      // Expectations
      expect(closedLots.length).toBe(1);
      expect(closedLots[0].id).toBe(expiredLot.id);

      // Verify the expired lot is now closed
      const updatedExpiredLot = await prismaService.prisma.lot.findUnique({
        where: { id: expiredLot.id },
        include: { finalBid: true }
      });

      expect(updatedExpiredLot.status).toBe(LotStatus.CLOSED);
      expect(updatedExpiredLot.finalBidId).toBe(bid.id);

      // Verify the active lot is still open
      const updatedActiveLot = await prismaService.prisma.lot.findUnique({
        where: { id: activeLot.id }
      });

      expect(updatedActiveLot.status).toBe(LotStatus.OPEN);
      expect(updatedActiveLot.finalBidId).toBeNull();
    });

    it('should handle lots with no bids when closing', async () => {
      // Create an expired lot with no bids
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 5); // 5 minutes ago

      const expiredLotNoBids = await prismaService.prisma.lot.create({
        data: {
          title: 'Expired Lot No Bids',
          startingPrice: 300,
          currentPrice: 300,
          status: LotStatus.OPEN,
          startTime: new Date(pastDate.getTime() - 3600000), // 1 hour before endTime
          endTime: pastDate,
        }
      });

      // Run the check lot closure method
      const closedLots = await lotService.checkLotClosure();

      // Expectations
      expect(closedLots.length).toBe(1);
      expect(closedLots[0].id).toBe(expiredLotNoBids.id);

      // Verify the lot is closed but has no final bid
      const updatedLot = await prismaService.prisma.lot.findUnique({
        where: { id: expiredLotNoBids.id }
      });

      expect(updatedLot.status).toBe(LotStatus.CLOSED);
      expect(updatedLot.finalBidId).toBeNull();
    });

    it('should close multiple expired lots in a single call', async () => {
      // Create a test user
      const user = await prismaService.prisma.user.create({
        data: {
          id: 'test-user-2',
          name: 'Test User 2',
          passwordHash: 'hash',
          role: 'user',
        }
      });

      // Create expired dates for different lots
      const pastDate1 = new Date();
      pastDate1.setMinutes(pastDate1.getMinutes() - 15); // 15 minutes ago

      const pastDate2 = new Date();
      pastDate2.setMinutes(pastDate2.getMinutes() - 30); // 30 minutes ago

      // Create first expired lot
      const expiredLot1 = await prismaService.prisma.lot.create({
        data: {
          title: 'Expired Lot 1',
          startingPrice: 100,
          currentPrice: 150,
          status: LotStatus.OPEN,
          startTime: new Date(pastDate1.getTime() - 3600000),
          endTime: pastDate1,
        }
      });

      // Create bid for first lot
      const bid1 = await prismaService.prisma.bid.create({
        data: {
          lotId: expiredLot1.id,
          userId: user.id,
          amount: 150,
        }
      });

      // Create second expired lot
      const expiredLot2 = await prismaService.prisma.lot.create({
        data: {
          title: 'Expired Lot 2',
          startingPrice: 200,
          currentPrice: 250,
          status: LotStatus.OPEN,
          startTime: new Date(pastDate2.getTime() - 3600000),
          endTime: pastDate2,
        }
      });

      // Create bid for second lot
      const bid2 = await prismaService.prisma.bid.create({
        data: {
          lotId: expiredLot2.id,
          userId: user.id,
          amount: 250,
        }
      });

      // Run the check lot closure method
      const closedLots = await lotService.checkLotClosure();

      // Verify that both lots were closed
      expect(closedLots.length).toBe(2);

      // Get the updated lots from the database
      const updatedLot1 = await prismaService.prisma.lot.findUnique({
        where: { id: expiredLot1.id },
        include: { finalBid: true },
      });

      const updatedLot2 = await prismaService.prisma.lot.findUnique({
        where: { id: expiredLot2.id },
        include: { finalBid: true },
      });

      // Verify both lots are now closed with their final bids
      expect(updatedLot1.status).toBe(LotStatus.CLOSED);
      expect(updatedLot1.finalBidId).toBe(bid1.id);

      expect(updatedLot2.status).toBe(LotStatus.CLOSED);
      expect(updatedLot2.finalBidId).toBe(bid2.id);
    });
  });
}); 
