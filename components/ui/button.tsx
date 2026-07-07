import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-foreground text-background shadow-[0_10px_30px_rgb(0_0_0_/_0.12)] hover:-translate-y-0.5 hover:bg-white/85 dark:hover:bg-white/85",
  secondary:
    "border-border bg-surface text-foreground hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-surface-muted",
  ghost:
    "border-transparent bg-transparent text-muted-foreground hover:-translate-y-0.5 hover:bg-surface hover:text-foreground",
};

const baseButtonClass =
  "inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonAsButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLinkProps = SharedButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = cn(baseButtonClass, buttonVariants[variant], className);

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLinkProps;

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButtonProps;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
