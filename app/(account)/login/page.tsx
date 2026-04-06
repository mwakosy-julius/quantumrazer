import { Suspense } from "react";

import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[400px] py-24 text-center text-grey-500">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
