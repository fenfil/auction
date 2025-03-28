"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { api } from "@/lib/api";
import { GetLot, GetLots } from "@repo/shared/dist/interfaces/lots";
import { DateTime } from "luxon";
import Link from "next/link";
import useSwr from "swr";

export default function Home() {
  const { data: lots, mutate } = useSwr("lots", (url) => api.get<GetLots.Response>(url).then((res) => res.data));

  useSocketEvent(`lot`, (data: GetLot.Response) => {
    mutate(lots?.map((lot) => lot.id === data.id ? data : lot));
  });

  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lots?.map((lot) => (
            <TableRow key={lot.id}>
              <TableCell>{lot.title}</TableCell>
              <TableCell>${lot.currentPrice}</TableCell>
              <TableCell>{lot.status}</TableCell>
              <TableCell>{DateTime.fromISO(lot.startTime).toLocaleString(DateTime.DATETIME_FULL)}</TableCell>
              <TableCell>{DateTime.fromISO(lot.endTime).toLocaleString(DateTime.DATETIME_FULL)}</TableCell>
              <TableCell>
                <Link href={`/lots/${lot.id}`}>
                  <Button>Open</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
