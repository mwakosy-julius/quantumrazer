import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "sale" | "muted" | "creator" | "lowStock" | "featured";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-brand px-2 py-1 text-[13px] font-medium",
        (variant === "default" || variant === "creator" || variant === "featured" || variant === "lowStock" || variant === "muted") &&
          "bg-white text-black",
        variant === "sale" && "border border-grey-200 bg-white text-black",
        className,
      )}
    >
      {children}
    </span>
  );
}
