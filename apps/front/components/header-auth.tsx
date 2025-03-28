'use client';

import Link from "next/link";
import { useMe } from "../hooks/useMe";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { tryCatcher } from "@/lib/error";

export const HeaderAuth = () => {
  const { isAuthenticated, username, mutate } = useMe();

  if (!isAuthenticated) {
    return (
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      <Button >
        {username}
      </Button>

      <Button variant="outline" onClick={() => tryCatcher(async () => {
        await api.post('/auth/logout');
        mutate();
      })}>
        Logout
      </Button>
    </div>
  );
};
