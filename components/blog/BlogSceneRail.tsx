"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { formatDate } from "@/lib/format";
import type { JournalEntry } from "@/components/blog/JournalShowcase";

const PAGE_SIZE = 4;
const pad = (value: number) => String(value).padStart(2, "0");

export function BlogSceneRail({
  posts,
  error,
}: {
  posts: JournalEntry[];
  error: boolean;
}) {
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * PAGE_SIZE;
  const visible = posts.slice(start, start + PAGE_SIZE);
  const end = Math.min(start + visible.length, posts.length);

  function go(next: number) {
    setPage(Math.max(0, Math.min(pageCount - 1, next)));
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(safePage + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(safePage - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      go(0);
    } else if (event.key === "End") {
      event.preventDefault();
      go(pageCount - 1);
    }
  }

  if (error) {
    return (
      <p className="blog-rail-empty" role="alert">
        Yazılar şu an yüklenemedi. Biraz sonra tekrar dene.
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="blog-rail-empty">
        İlk yazı yayınlandığında burada görünecek.
      </p>
    );
  }

  return (
    <div className="blog-rail">
      <motion.ul
        key={safePage}
        className="blog-rail-grid"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {visible.map((post, offset) => {
          const index = start + offset;
          return (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="blog-rail-item">
                <span className="blog-rail-index" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <span className="blog-rail-copy">
                  <span className="blog-rail-meta">
                    {post.publishedAt ? (
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    ) : (
                      <span>Taslak yakını</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{post.minutes} dk</span>
                    {post.category ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{post.category}</span>
                      </>
                    ) : null}
                  </span>
                  <strong>{post.title}</strong>
                  {post.excerpt ? (
                    <span className="blog-rail-excerpt">{post.excerpt}</span>
                  ) : null}
                </span>
                <ArrowUpRight
                  className="blog-rail-arrow"
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </motion.ul>

      {posts.length > PAGE_SIZE ? (
        <nav
          className="blog-rail-pager"
          aria-label="Yazı sayfaları"
          onKeyDown={onKeyDown}
        >
          <button
            type="button"
            aria-label="Önceki 4 yazı"
            disabled={safePage === 0}
            onClick={() => go(safePage - 1)}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <span className="blog-rail-counter" aria-live="polite">
            {pad(start + 1)}–{pad(end)} / {pad(posts.length)}
          </span>
          <button
            type="button"
            aria-label="Sonraki 4 yazı"
            disabled={safePage >= pageCount - 1}
            onClick={() => go(safePage + 1)}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
