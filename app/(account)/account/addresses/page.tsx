import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/addresses");

  return (
    <div>
      <h1 className="text-2xl font-black">Addresses</h1>
      <p className="mt-4 text-[14px] text-grey-500">
        Saved addresses will appear here. Checkout currently uses a single demo shipping address; extend with{" "}
        <code className="text-[13px]">user.actions.ts</code> when you are ready.
      </p>
    </div>
  );
}
