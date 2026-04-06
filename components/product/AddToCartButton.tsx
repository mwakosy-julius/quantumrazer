"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { addToCartAction } from "@/actions/cart.actions";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

export function AddToCartButton({
  variantId,
  disabled,
  label = "Add to Bag",
}: {
  variantId: string | null;
  disabled?: boolean;
  label?: string;
}) {
  const router = useRouter();
  const openCart = useCartStore((s) => s.openCart);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  return (
    <Button
      className="h-14 w-full text-[16px]"
      disabled={disabled || !variantId || state === "loading"}
      onClick={async () => {
        if (!variantId) return;
        setState("loading");
        const res = await addToCartAction({ variantId, quantity: 1 });
        if (res?.serverError) {
          setState("idle");
          return;
        }
        setState("done");
        router.refresh();
        openCart();
        setTimeout(() => setState("idle"), 1500);
      }}
    >
      {state === "loading" ? "Adding…" : state === "done" ? "Added ✓" : label}
    </Button>
  );
}
