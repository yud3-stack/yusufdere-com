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
        "inline-flex items-center rounded-full border border-border bg-surface p-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
      aria-label="Language switcher"
    >
      <Link
        href={withLocalePrefix(basePath, "en")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors duration-200 hover:text-foreground",
          !isTurkish && "bg-foreground text-background hover:text-background",
        )}
        aria-current={!isTurkish ? "page" : undefined}
      >
        EN
      </Link>
      <Link
        href={withLocalePrefix(basePath, "tr")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors duration-200 hover:text-foreground",
          isTurkish && "bg-foreground text-background hover:text-background",
        )}
        aria-current={isTurkish ? "page" : undefined}
      >
        TR
      </Link>
    </div>
  );
}
