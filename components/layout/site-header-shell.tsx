"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

type SiteHeaderShellProps = {
  children: ReactNode;
};

export function SiteHeaderShell({ children }: SiteHeaderShellProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => {
      setScrolled(window.scrollY > 12);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolled);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-border bg-background/82 shadow-[0_1px_0_rgb(255_255_255_/_0.03)] backdrop-blur-xl"
          : "border-transparent bg-background/68 backdrop-blur-md",
      )}
    >
      {children}
    </header>
  );
}
