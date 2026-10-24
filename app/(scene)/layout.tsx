"use client";

import type { ReactNode } from "react";
import { LayoutGroup } from "framer-motion";

export default function SceneLayout({ children }: { children: ReactNode }) {
  return <LayoutGroup id="yd-scene">{children}</LayoutGroup>;
}
