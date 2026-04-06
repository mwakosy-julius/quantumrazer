"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { loginAction } from "@/actions/auth.actions";
import { mergeGuestCartAction } from "@/actions/cart.actions";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[400px] flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-black">Sign In</h1>
      <form
        className="mt-8 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          const res = await loginAction({ email, password });
          if (res?.serverError) {
            setError(res.serverError);
            return;
          }
          await mergeGuestCartAction({});
          router.refresh();
          router.push(callbackUrl);
        }}
      >
        <input
          className="w-full rounded border border-grey-200 px-4 py-3 text-[15px]"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-grey-200 px-4 py-3 text-[15px]"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-[13px] text-red-brand">{error}</p>}
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
      <Button
        variant="outline"
        className="mt-4 w-full"
        type="button"
        onClick={() => void signIn("google", { callbackUrl })}
      >
        Continue with Google
      </Button>
      <p className="mt-6 text-center text-[14px] text-grey-500">
        New here?{" "}
        <Link href="/register" className="underline">
          Join us
        </Link>
      </p>
    </div>
  );
}
