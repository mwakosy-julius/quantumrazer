"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { loginAction } from "@/actions/auth.actions";
import { mergeGuestCartAction } from "@/actions/cart.actions";
import { QuantumRazerLogo } from "@/components/brand/QuantumRazerLogo";

/** App Router `router.push` only accepts in-app paths; block open redirects and bad URLs. */
function safePostLoginPath(raw: string | null): string {
  const fallback = "/account";
  if (raw == null || raw === "") return fallback;
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  if (path.includes("://")) return fallback;
  return path;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safePostLoginPath(searchParams.get("callbackUrl"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[380px] px-6 py-20">
      <div className="mb-8 flex justify-center">
        <QuantumRazerLogo size="compact" theme="light" href="/" />
      </div>
      <h1 className="text-center text-[24px] font-bold text-black">Welcome Back.</h1>
      <form
        className="mt-8 space-y-5"
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
        <div>
          <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-[0.02em] text-black">Email</label>
          <input
            className="h-12 w-full rounded-brand border border-grey-300 bg-white px-4 text-[15px] text-black outline-none focus:border-black"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-[0.02em] text-black">Password</label>
          <input
            className="h-12 w-full rounded-brand border border-grey-300 bg-white px-4 text-[15px] text-black outline-none focus:border-black"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-[13px] text-black">{error}</p>}
        <button
          type="submit"
          className="flex h-[52px] w-full items-center justify-center rounded-pill bg-black text-[16px] font-medium text-white transition-colors hover:bg-grey-700"
        >
          Sign In
        </button>
      </form>
      <button
        type="button"
        className="mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-pill border border-grey-300 bg-white text-[16px] font-medium text-black transition-colors hover:border-black"
        onClick={() => void signIn("google", { callbackUrl })}
      >
        <span aria-hidden>G</span> Continue with Google
      </button>
      <p className="mt-8 text-center text-[14px] text-grey-500">
        New here?{" "}
        <Link href="/register" className="text-black underline hover:text-grey-500">
          Become a Member
        </Link>
      </p>
    </div>
  );
}
