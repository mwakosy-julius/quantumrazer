import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "outline" | "inverse" | "accent" | "black";
  }
>(function Button({ className, variant = "primary", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-pill px-8 py-3.5 text-[16px] font-medium tracking-[0.02em] transition-colors duration-200 disabled:opacity-50",
        (variant === "black" || variant === "primary" || variant === "accent" || variant === "inverse") &&
          "bg-black text-white hover:bg-grey-700",
        variant === "ghost" && "bg-transparent text-black hover:bg-grey-100",
        variant === "outline" && "border border-black bg-transparent text-black hover:bg-grey-100",
        className,
      )}
      {...props}
    />
  );
});
