"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import "@/app/brand-intro.css";

export function BrandIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const started = Number(root.getAttribute("data-brand-intro-start")) || 0;
    const remaining = root.getAttribute("data-brand-intro") === "playing" && !reduce.matches
      ? Math.max(0, 2100 - (Date.now() - started)) : 0;
    const skip = () => {
      root.setAttribute("data-brand-intro", "done");
      setActive(false);
    };
    const finish = window.setTimeout(skip, remaining);
    reduce.addEventListener("change", skip);
    return () => {
      window.clearTimeout(finish);
      reduce.removeEventListener("change", skip);
    };
  }, []);

  if (!active) return null;
  return (
    <div className="brand-intro" aria-hidden="true" onAnimationEnd={(event) => {
      if (event.target === event.currentTarget) {
        document.documentElement.setAttribute("data-brand-intro", "done");
        setActive(false);
      }
    }}>
      <div className="brand-intro-signature">
        <span className="brand-intro-mark">YD</span>
        <span className="brand-intro-name"><span>{site.name}</span></span>
      </div>
    </div>
  );
}
