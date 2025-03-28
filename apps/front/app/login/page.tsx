"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSignin } from "@repo/shared/dist/interfaces/auth";
import { api } from "@/lib/api";
import { tryCatcher } from "@/lib/error";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useMe } from "@/hooks/useMe";
export default function LoginPage() {
  const me = useMe();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => tryCatcher(async () => {
    await api.post<AuthSignin.Response>('/auth/login', { username, password } as AuthSignin.Request);
    toast.success('Login successful');
    me.mutate();
    router.push('/');
  });

  return (
    <div className="max-w-[400px] mx-auto flex flex-col gap-4">
      <Label htmlFor="username">
        Username
      </Label>
      <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Label htmlFor="password">
        Password
      </Label>
      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleLogin}>Login</Button>
      <p>Don&apos;t have an account? <Link href="/signup">Signup</Link></p>
    </div>
  );
}
