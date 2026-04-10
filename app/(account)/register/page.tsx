"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerAction } from "@/actions/auth.actions";
import { mergeGuestCartAction } from "@/actions/cart.actions";
import { QuantumRazerLogo } from "@/components/brand/QuantumRazerLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[380px] px-6 py-20">
      <div className="mb-8 flex justify-center">
        <QuantumRazerLogo size="compact" theme="light" href="/" />
      </div>
      <h1 className="text-center text-[24px] font-bold text-black">Join the Collective.</h1>
      <form
        className="mt-8 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          const res = await registerAction({ email, password, firstName, lastName });
          if (res?.serverError) {
            setError(res.serverError);
            return;
          }
          await mergeGuestCartAction({});
          router.refresh();
          router.push("/account");
        }}
      >
        <div>
          <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-[0.02em] text-black">First name</label>
          <input
            className="h-12 w-full rounded-brand border border-grey-300 bg-white px-4 text-[15px] text-black outline-none focus:border-black"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-[0.02em] text-black">Last name</label>
          <input
            className="h-12 w-full rounded-brand border border-grey-300 bg-white px-4 text-[15px] text-black outline-none focus:border-black"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-[0.02em] text-black">Email</label>
          <input
            className="h-12 w-full rounded-brand border border-grey-300 bg-white px-4 text-[15px] text-black outline-none focus:border-black"
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        {error && <p className="text-[13px] text-black">{error}</p>}
        <button
          type="submit"
          className="flex h-[52px] w-full items-center justify-center rounded-pill bg-black text-[16px] font-medium text-white transition-colors hover:bg-grey-700"
        >
          Become a Member
        </button>
      </form>
      <p className="mt-8 text-center text-[14px] text-grey-500">
        Already a member?{" "}
        <Link href="/login" className="text-black underline hover:text-grey-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}
