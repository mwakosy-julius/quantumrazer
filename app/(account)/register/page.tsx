"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerAction } from "@/actions/auth.actions";
import { mergeGuestCartAction } from "@/actions/cart.actions";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[400px] flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-black">Join Us</h1>
      <form
        className="mt-8 space-y-4"
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
        <input
          className="w-full rounded border border-grey-200 px-4 py-3 text-[15px]"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-grey-200 px-4 py-3 text-[15px]"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
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
          placeholder="Password (min 8, uppercase + number)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        {error && <p className="text-[13px] text-red-brand">{error}</p>}
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
      <p className="mt-6 text-center text-[14px] text-grey-500">
        Already a member?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
