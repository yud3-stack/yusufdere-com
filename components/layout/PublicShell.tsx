"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@/components/cookies/Analytics";
import { CookieConsent } from "@/components/cookies/CookieConsent";
import { AdminToolbar } from "@/components/layout/AdminToolbar";

export function PublicShell({
  children,
  header,
  publicFooter,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  publicFooter: ReactNode;
}) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  const fullscreen =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/blog" ||
    pathname === "/projects";
  if (admin) return <main id="icerik">{children}</main>;
  return (
    <div
      className={`public-site${fullscreen ? " fullscreen-scene" : ""}${pathname === "/" ? " home-scene" : ""}${pathname === "/about" ? " about-scene-page" : ""}`}
    >
      <div className="public-navigation">
        <AdminToolbar />
        {header}
      </div>
      <main id="icerik">{children}</main>
      {!fullscreen ? publicFooter : null}
      <CookieConsent />
      <Analytics />
    </div>
  );
}
