import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-live="polite" aria-busy="true" className={cn("bg-muted animate-pulse rounded-md", className)} {...props}>
      <span className="inline-flex w-full leading-none">‌</span>
      <br />
    </div>
  );
}

export { Skeleton };
