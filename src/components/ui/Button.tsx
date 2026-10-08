import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "mint";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-ink)] hover:bg-[var(--color-primary-hover)] shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_1px_2px_rgba(11,26,20,0.2)]",
  mint: "bg-[var(--color-mint)] text-[#03261a] hover:brightness-105 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_1px_2px_rgba(4,60,38,0.25)]",
  secondary:
    "bg-[var(--color-bg-elevated)] text-[var(--color-ink)] border border-[var(--color-border-strong)] hover:border-[var(--color-ink-faint)] shadow-[var(--shadow-card)]",
  ghost: "bg-transparent text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]",
  danger: "bg-[var(--color-danger)] text-[var(--color-danger-ink)] hover:brightness-110",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[12.5px] gap-1.5 rounded-[10px]",
  md: "h-10 px-4 text-[13.5px] gap-2 rounded-[var(--radius-control)]",
  lg: "h-12 px-5 text-[14.5px] gap-2 rounded-[14px]",
};

export function Button({ variant = "primary", size = "md", icon, iconRight, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "group/btn inline-flex select-none items-center justify-center whitespace-nowrap font-medium tracking-[-0.005em] transition-[background-color,border-color,color,transform,filter] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
      {iconRight && <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">{iconRight}</span>}
    </button>
  );
}
