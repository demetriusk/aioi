import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/20 text-primary-foreground",
        low: "border-risk-low bg-risk-low-bg text-risk-low-text",
        medium: "border-risk-medium bg-risk-medium-bg text-risk-medium-text",
        high: "border-risk-high bg-risk-high-bg text-risk-high-text",
        critical: "border-risk-critical bg-risk-critical-bg text-risk-critical-text",
        outline: "border-border text-muted-foreground bg-white/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
