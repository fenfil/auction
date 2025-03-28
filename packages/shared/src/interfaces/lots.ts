
export enum LotStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface Lot {
  id: number;
  title: string;
  startingPrice: number;
  currentPrice: number;
  status: LotStatus;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface Bid {
  id: number;
  lotId: number;
  userId: string;
  amount: number;
  createdAt: string;
}

export interface FinalBid extends Bid {
  id: number;
  lotId: number;
  userId: string;
  amount: number;
  createdAt: string;

  user: {
    id: string;
    name: string;
  };
}


export interface LotWithBids extends Lot {
  bids: Bid[];
  finalBid?: FinalBid;
}

export namespace GetLots {
  export type Response = LotWithBids[];
}

export namespace GetLot {
  export type Response = LotWithBids;
}

export namespace PlaceBid {
  export interface Request {
    amount: number;
  }
  export interface Response extends Bid {
  }
}


export namespace GetBids {
  export type Response = Bid[];
}
