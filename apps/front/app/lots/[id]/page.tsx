"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { api } from "@/lib/api";
import { tryCatcher } from "@/lib/error";
import { GetLot, LotStatus } from "@repo/shared/dist/interfaces/lots";
import { DateTime } from "luxon";
import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSwr from "swr";

export default function Home() {
  const { id } = useParams();
  const [bidAmount, setBidAmount] = useState(0);
  const timeRef = useRef<HTMLSpanElement>(null);
  const { data: lot, isLoading, mutate } = useSwr(`lots/${id}`, (url) => api.get<GetLot.Response>(url).then((res) => res.data));

  useSocketEvent(`lot`, (data: GetLot.Response) => {
    mutate(data);
  });

  const placeBig = () => tryCatcher(async () => {
    await api.post(`lots/${id}/bids`, { amount: bidAmount })
    setBidAmount(0);
    toast.success('Bid placed');
  });

  useEffect(() => {
    let ended = false;
    const endTime = DateTime.fromISO(lot?.endTime ?? "").toMillis();

    const animate = () => {
      if (ended) return;
      requestAnimationFrame(animate);
      if (!timeRef.current) return;
      if (!endTime) return;

      const now = Date.now();


      if (now < endTime) {
        const diff = endTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        timeRef.current.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      } else {
        ended = true;
      }
    }

    animate();

    return () => {
      ended = true;
    }
  }, [lot]);


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!lot) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-[1fr_300px] gap-4">
      <div>
        <p>Current Price: ${lot.currentPrice}</p>
        <p>Starting Price: ${lot.startingPrice}</p>
        <p>Status: {lot.status}</p>
        <p>Start Time: {DateTime.fromISO(lot.startTime).toLocaleString(DateTime.DATETIME_FULL)}</p>
        <p>End Time: {DateTime.fromISO(lot.endTime).toLocaleString(DateTime.DATETIME_FULL)}</p>
        <p>Time Left: <span ref={timeRef}></span></p>
        <p>Bids: {lot.bids.map((bid) => `$${bid.amount}`).join(", ")}</p>
        {lot.finalBid && <p>Final Bid: ${lot.finalBid?.amount} by {lot.finalBid?.user?.name || 'Unknown'}</p>}
      </div>
      <div className="flex flex-col gap-4">
        <Input type="number" value={bidAmount} onChange={(e) => setBidAmount(Number(e.target.value))} />
        <Button onClick={placeBig} disabled={bidAmount <= lot.currentPrice || LotStatus.CLOSED === lot.status}>Place Bid</Button>
      </div>
    </div>
  );
}
