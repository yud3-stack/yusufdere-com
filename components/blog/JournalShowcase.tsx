"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import {
  ArrowUpRight,
  Asterisk,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { journal } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { JournalCover } from "@/components/blog/JournalCover";

export type JournalEntry = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover: string | null;
  category: string | null;
  publishedAt: string | null;
  minutes: number;
};

const number = (value: number) => String(value).padStart(2, "0");

export function JournalShowcase({
  posts,
  error,
}: {
  posts: JournalEntry[];
  error: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, Math.max(0, posts.length - 1));
  const post = posts[index];
  const pageStart = Math.floor(index / 2) * 2;
  const visiblePosts = posts.slice(pageStart, pageStart + 2);

  function change(next: number) {
    setSelected(Math.max(0, Math.min(posts.length - 1, next)));
  }
  function navigate(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      change(index + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      change(event.key === "Home" ? 0 : posts.length - 1);
    }
  }

  return (
    <section className="journal-showcase" aria-labelledby="journal-heading">
      <div className="journal-stage">
        <div className="journal-intro">
          <div className="journal-intro-copy">
            <p className="eyebrow">{journal.eyebrow}</p>
            <h1 id="journal-heading">
              {journal.title}
              <br />
              <em>{journal.titleEmphasis}</em>
            </h1>
            <p className="journal-description">{journal.description}</p>
          </div>
        </div>

        {post ? (
          <article
            key={post.id}
            id="journal-selected"
            className="journal-feature"
            aria-labelledby="journal-post-title"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="journal-feature-cover"
              tabIndex={-1}
              aria-hidden="true"
            >
              <JournalCover
                key={post.cover}
                src={post.cover}
                title={post.title}
              />
            </Link>
            <div className="journal-feature-copy">
              <div className="journal-feature-meta">
                <span className="journal-selected-label">
                  <i aria-hidden="true" /> Seçili yazı
                </span>
                <span>
                  {post.publishedAt ? (
                    <>
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                      <span className="journal-meta-dot">·</span>
                    </>
                  ) : null}
                  {post.minutes} dk okuma
                </span>
              </div>
              <h2 id="journal-post-title">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.excerpt ? (
                <p className="journal-excerpt">{post.excerpt}</p>
              ) : null}
              <Link href={`/blog/${post.slug}`} className="journal-read">
                Yazıyı oku <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ) : (
          <div className="journal-empty">
            <Asterisk size={42} strokeWidth={1} aria-hidden="true" />
            <h2>{error ? "Kısa bir ara." : "Yeni notlara yer açıyorum."}</h2>
            <p>
              {error
                ? "Yazılar şu an yüklenemedi. Lütfen daha sonra tekrar dene."
                : "İlk yazı yayınlandığında burada görünecek."}
            </p>
            {error ? (
              <Link href="/blog" className="journal-read">
                Yeniden dene <ArrowUpRight size={16} />
              </Link>
            ) : null}
          </div>
        )}
      </div>

      {post ? (
        <nav
          className="journal-selector"
          aria-label="Yazı seçimi"
          onKeyDown={navigate}
        >
          <div className="journal-options">
            {visiblePosts.map((entry, offset) => (
              <button
                type="button"
                key={entry.id}
                className={`journal-option${entry.id === post.id ? " is-selected" : ""}`}
                aria-pressed={entry.id === post.id}
                aria-controls="journal-selected"
                onClick={() => change(pageStart + offset)}
              >
                <span className="journal-option-index">
                  {number(pageStart + offset + 1)}
                </span>
                <span className="journal-option-cover">
                  <JournalCover
                    key={entry.cover}
                    src={entry.cover}
                    title={entry.title}
                    thumbnail
                  />
                </span>
                <span className="journal-option-title">{entry.title}</span>
              </button>
            ))}
          </div>
          <div className="journal-controls">
            <button
              type="button"
              aria-label="Önceki yazı"
              aria-controls="journal-selected"
              disabled={index === 0}
              onClick={() => change(index - 1)}
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Sonraki yazı"
              aria-controls="journal-selected"
              disabled={index === posts.length - 1}
              onClick={() => change(index + 1)}
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
            <span className="journal-counter" aria-hidden="true">
              {number(index + 1)} / {number(posts.length)}
            </span>
          </div>
        </nav>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {post ? `${index + 1} / ${posts.length}: ${post.title}` : ""}
      </p>
    </section>
  );
}
