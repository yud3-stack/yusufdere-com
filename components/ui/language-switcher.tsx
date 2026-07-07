"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { stripLocalePrefix, withLocalePrefix } from "@/lib/locale";
import { cn } from "@/lib/utils/cn";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const pathname = usePathname() || "/";
  const basePath = stripLocalePrefix(pathname);
  const isTurkish = pathname === "/tr" || pathname.startsWith("/tr/");

  return (
    <div
      className={cn(
        "inline-flex h-9 items-center rounded-full border border-border bg-background/45 p-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
      aria-label="Language switcher"
    >
      <Link
        href={withLocalePrefix(basePath, "en")}
        className={cn(
          "rounded-full px-2.5 py-1.5 transition-colors duration-200 hover:text-foreground",
          !isTurkish && "bg-surface-muted text-foreground shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.04)]",
        )}
        aria-current={!isTurkish ? "page" : undefined}
      >
        EN
      </Link>
      <Link
        href={withLocalePrefix(basePath, "tr")}
        className={cn(
          "rounded-full px-2.5 py-1.5 transition-colors duration-200 hover:text-foreground",
          isTurkish && "bg-surface-muted text-foreground shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.04)]",
        )}
        aria-current={isTurkish ? "page" : undefined}
      >
        TR
      </Link>
    </div>
  );
}
