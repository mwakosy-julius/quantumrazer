import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "sale" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-sm px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
        variant === "default" && "bg-black text-white",
        variant === "sale" && "bg-red-brand text-white",
        variant === "muted" && "bg-grey-700 text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
