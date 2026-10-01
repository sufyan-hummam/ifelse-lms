import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground",
        secondary:
          "border border-border bg-secondary text-secondary-foreground",
        outline:
          "border border-border text-foreground",
        logic:
          "font-mono uppercase text-[11px] border border-brand-blue/30 bg-brand-blue/10 text-brand-sky",
        electric:
          "border border-brand-sky/30 bg-brand-blue/20 text-brand-sky",
        emerald:
          "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        amber:
          "border border-amber-500/20 bg-amber-500/10 text-amber-400",
        rose:
          "border border-rose-500/20 bg-rose-500/10 text-rose-400",
        violet:
          "border border-purple-500/20 bg-purple-500/10 text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
