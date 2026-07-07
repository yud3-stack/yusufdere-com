"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const splashStorageKey = "yusufdere:splash-seen";
const showDurationMs = 920;
const fadeDurationMs = 360;

export function SplashScreen() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/tr") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(splashStorageKey, "true");
      return;
    }

    if (sessionStorage.getItem(splashStorageKey) === "true") {
      return;
    }

    sessionStorage.setItem(splashStorageKey, "true");

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 0);
    const leaveTimer = window.setTimeout(() => {
      setLeaving(true);
    }, showDurationMs);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      setLeaving(false);
    }, showDurationMs + fadeDurationMs);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] transition-opacity duration-300 ease-out ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center transition-all duration-700 ease-out ${
          leaving ? "scale-[0.98] opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg font-semibold tracking-tight text-white shadow-[0_0_60px_rgb(255_255_255_/_0.06)]">
          YD
        </div>
        <p className="mt-5 text-sm font-medium tracking-[0.28em] text-white/55">
          Yusuf Dere
        </p>
      </div>
    </div>
  );
}

export { splashStorageKey };
