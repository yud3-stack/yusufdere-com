"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

function sceneFromPath(pathname: string) {
  if (pathname === "/blog") return "blog";
  if (pathname === "/about") return "about";
  return "home";
}

export function PortraitCutout() {
  const pathname = usePathname();
  const scene = sceneFromPath(pathname);
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="portrait-cutout"
      layoutId="yd-portrait"
      layoutDependency={scene}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 80, damping: 20, mass: 0.85 }
      }
    >
      <Image
        src="/images/hero/yusuf-portrait-complete-v2.png"
        alt="Yusuf Dere'nin siyah beyaz portresi"
        fill
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 55vw, 520px"
      />
    </motion.div>
  );
}
