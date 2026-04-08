import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "primary";
}

export function CalButton({ variant = "ghost", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variant === "ghost" && "hover:bg-muted p-2",
        variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90 px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
