"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMe } from "@/hooks/useMe";
import { api } from "@/lib/api";
import { tryCatcher } from "@/lib/error";
import { AuthRegister } from "@repo/shared/dist/interfaces/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const me = useMe();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignup = () => tryCatcher(async () => {
    await api.post<AuthRegister.Response>('/auth/signup', { username, password, confirmPassword } as AuthRegister.Request);
    toast.success('Signup successful');
    me.mutate();
    router.push('/');
  });

  return (
    <div className="max-w-[400px] mx-auto flex flex-col gap-4">
      <Label htmlFor="username">Username</Label>
      <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <Button disabled={!password || password !== confirmPassword} onClick={handleSignup}>Signup</Button>
      <p>Already have an account? <Link href="/login">Login</Link></p>
    </div>
  );
}
