import { cn } from "@/lib/utils";

export function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("font-display text-2xl md:text-3xl text-foreground", className)}>{children}</h2>;
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-body text-xs uppercase tracking-widest text-muted-foreground", className)}>{children}</span>;
}
