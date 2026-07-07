"use client";

import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisible = () => {
      setVisible(window.scrollY > 520);
    };

    updateVisible();
    window.addEventListener("scroll", updateVisible, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisible);
    };
  }, []);

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      }}
      className={`fixed bottom-5 right-5 z-40 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/78 text-muted-foreground shadow-[0_12px_40px_rgb(0_0_0_/_0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6 sm:right-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
