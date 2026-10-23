"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { Container } from "@/components/layout/Container";

export function AdminToolbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let currentRequest: AbortController | undefined;
    function checkSession() {
      currentRequest?.abort();
      const request = new AbortController();
      currentRequest = request;
      fetch("/api/admin/session", { cache: "no-store", credentials: "same-origin", signal: request.signal })
        .then(async response => {
          const session = response.ok ? await response.json() : null;
          if (!request.signal.aborted) setIsAdmin(session?.isAdmin === true);
        })
        .catch(() => {
          if (!request.signal.aborted) setIsAdmin(false);
        });
    }
    function checkVisibleSession() {
      if (document.visibilityState === "visible") checkSession();
    }
    checkSession();
    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", checkVisibleSession);
    return () => {
      currentRequest?.abort();
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", checkVisibleSession);
    };
  }, [pathname]);

  if (!isAdmin) return null;

  return (
    <nav className="public-admin-bar" aria-label="Yönetici kısayolları">
      <Container className="public-admin-bar-inner">
        <span className="public-admin-label">Admin</span>
        <Link href="/admin/posts/new" prefetch={false}><Plus size={14} aria-hidden="true" />Yeni Yazı</Link>
        <Link href="/admin/projects/new" prefetch={false}><Plus size={14} aria-hidden="true" />Yeni Proje</Link>
        <Link href="/admin" prefetch={false} className="public-admin-dashboard">Panele git<ArrowUpRight size={16} aria-hidden="true" /></Link>
      </Container>
    </nav>
  );
}
