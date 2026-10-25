"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Clock3, Plus, Users } from "lucide-react";
import { Container } from "@/components/layout/Container";

type PostStats = {
  readers: number | null;
  averageDuration: string | null;
  periodDays: number;
  ready: boolean;
};

function blogPostPath(pathname: string) {
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  return match ? `/blog/${match[1]}` : null;
}

export function AdminToolbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [statsResult, setStatsResult] = useState<{ path: string; data: PostStats } | null>(null);
  const pathname = usePathname();
  const postPath = blogPostPath(pathname);
  const postStats = isAdmin && statsResult?.path === postPath ? statsResult.data : null;

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

  useEffect(() => {
    if (!isAdmin || !postPath) {
      return;
    }

    const request = new AbortController();
    fetch(`/api/admin/post-stats?path=${encodeURIComponent(postPath)}`, {
      cache: "no-store",
      credentials: "same-origin",
      signal: request.signal,
    })
      .then(async response => {
        const payload = await response.json().catch(() => null);
        if (request.signal.aborted || !payload) return;
        setStatsResult({ path: postPath, data: {
          ready: payload.ready === true,
          readers: typeof payload.readers === "number" ? payload.readers : null,
          averageDuration: typeof payload.averageDuration === "string" ? payload.averageDuration : null,
          periodDays: typeof payload.periodDays === "number" ? payload.periodDays : 30,
        } });
      })
      .catch(() => {
        if (!request.signal.aborted) {
          setStatsResult({ path: postPath, data: { ready: false, readers: null, averageDuration: null, periodDays: 30 } });
        }
      });

    return () => request.abort();
  }, [isAdmin, postPath]);

  if (!isAdmin) return null;

  const readersLabel =
    postStats?.readers === null || postStats?.readers === undefined
      ? "—"
      : postStats.readers.toLocaleString("tr-TR");
  const durationLabel = postStats?.averageDuration || "—";

  return (
    <nav className="public-admin-bar" aria-label="Yönetici kısayolları">
      <Container className="public-admin-bar-inner">
        <span className="public-admin-label">Admin</span>
        {postPath ? (
          <p className="public-admin-reading" aria-live="polite">
            <span>
              <Users size={13} aria-hidden="true" />
              {readersLabel} okuyucu
            </span>
            <span>
              <Clock3 size={13} aria-hidden="true" />
              {durationLabel} ort.
            </span>
            <span className="public-admin-reading-period">Son {postStats?.periodDays ?? 30} gün</span>
          </p>
        ) : null}
        <Link href="/admin/posts/new" prefetch={false}>
          <Plus size={14} aria-hidden="true" />
          Yeni Yazı
        </Link>
        <Link href="/admin/projects/new" prefetch={false}>
          <Plus size={14} aria-hidden="true" />
          Yeni Proje
        </Link>
        <Link href="/admin" prefetch={false} className="public-admin-dashboard">
          Panele git
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </Container>
    </nav>
  );
}
