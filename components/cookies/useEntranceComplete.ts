"use client";

import { useEffect, useState } from "react";

// Follow real entrance animations, without waiting for perpetual decorative motion.
export function useEntranceComplete() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | undefined;
    let releaseIntro: (() => void) | undefined;

    async function waitForEntrance() {
      await document.fonts.ready;
      if (cancelled) return;
      const root = document.documentElement;
      if (root.getAttribute("data-brand-intro") === "playing") {
        await new Promise<void>((resolve) => {
          releaseIntro = resolve;
          observer = new MutationObserver(() => {
            if (root.getAttribute("data-brand-intro") !== "playing") {
              observer?.disconnect();
              resolve();
            }
          });
          observer.observe(root, { attributes: true, attributeFilter: ["data-brand-intro"] });
        });
      }
      if (cancelled) return;
      // Let the intro's removal resume the underlying page's CSS animations first.
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (cancelled) return;
      const entrance = document.querySelector(".public-site")?.getAnimations({ subtree: true })
        .filter((animation) => animation.playState !== "finished" &&
          animation.effect?.getTiming().iterations !== Infinity) ?? [];
      await Promise.allSettled(entrance.map((animation) => animation.finished));
      if (!cancelled) setReady(true);
    }

    void waitForEntrance();
    return () => {
      cancelled = true;
      observer?.disconnect();
      releaseIntro?.();
    };
  }, []);

  return ready;
}
