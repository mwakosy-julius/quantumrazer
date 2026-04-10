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
  variant = "black",
  className,
}: {
  variantId: string | null;
  disabled?: boolean;
  label?: string;
  variant?: "primary" | "inverse" | "black" | "accent";
  className?: string;
}) {
  const router = useRouter();
  const openCart = useCartStore((s) => s.openCart);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  return (
    <Button
      variant={variant}
      className={className ?? "h-14 w-full text-[15px] font-semibold uppercase tracking-[0.08em]"}
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
        setTimeout(() => setState("idle"), 2000);
      }}
    >
      {state === "loading" ? "Adding…" : state === "done" ? "Added ✓" : label}
    </Button>
  );
}
