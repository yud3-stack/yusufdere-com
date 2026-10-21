"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@/components/cookies/Analytics";
import { CookieConsent } from "@/components/cookies/CookieConsent";

export function PublicShell({ children, header, publicFooter }: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  publicFooter: ReactNode;
}) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (admin) return <main id="icerik">{children}</main>;
  return (
    <div className="public-site">
      {header}
      <main id="icerik">{children}</main>
      {publicFooter}
      <CookieConsent />
      <Analytics />
    </div>
  );
}
