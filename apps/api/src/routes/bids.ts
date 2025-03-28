import express from 'express';
import { BadRequestError } from '../errors';
import { requireAuth } from '../middleware/auth';
import bidService from '../services/bid.service';
import lotService from '../services/lot.service';
import { socketService } from '../services/socket.service';
import { GetBids, PlaceBid } from '@repo/shared/dist/interfaces/lots';

const router = express.Router();

router.get('/:lotId/bids', async (req, res) => {
  const lotId = parseInt(req.params.lotId);
  const bids = await bidService.findByLotId(lotId);
  res.json(bids.map(bidService.cleanBid) as GetBids.Response);
});


router.post('/:lotId/bids', requireAuth, async (req, res) => {
  const lotId = parseInt(req.params.lotId);
  const { amount } = req.body as PlaceBid.Request;

  if (!amount || isNaN(Number(amount))) {
    throw new BadRequestError('Bid amount is required and must be a number');
  }


  const userId = req.session.userId;

  const bid = await bidService.placeBid(lotId, userId, { amount });

  socketService.lotChanged(lotService.cleanLot(await lotService.findOne(lotId)));

  res.json(bidService.cleanBid(bid) as PlaceBid.Response);
});

export default router; 
