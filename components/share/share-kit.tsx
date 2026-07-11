"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";

type ShareContentType = "journal" | "project";

type ShareKitProps = {
  type: ShareContentType;
  slug: string;
  title: string;
  description: string;
  locale?: Locale;
};

const siteUrl = "https://yusufdere.com";

export function ShareKit({
  type,
  slug,
  title,
  description,
  locale = "en",
}: ShareKitProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const dictionary = getDictionary(locale);
  const contentPath = useMemo(
    () =>
      locale === "tr"
        ? `/tr/${type === "journal" ? "journal" : "projects"}/${slug}`
        : `/${type === "journal" ? "journal" : "projects"}/${slug}`,
    [locale, slug, type],
  );
  const shareImagePath = useMemo(
    () =>
      `/api/share/${type}/${slug}?locale=${locale}&format=story`,
    [locale, slug, type],
  );
  const caption = useMemo(() => {
    const action =
      type === "journal"
        ? dictionary.share.captionReadMore
        : dictionary.share.captionViewProject;

    return `${title}\n\n${description}\n\n${action}:\n${siteUrl}${contentPath}`;
  }, [contentPath, description, dictionary, title, type]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function downloadStoryCard() {
    setIsDownloading(true);

    try {
      const response = await fetch(shareImagePath);

      if (!response.ok) {
        throw new Error("Share image request failed.");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = `yusufdere-${type}-${slug}-story.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(shareImagePath, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {dictionary.share.label}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {dictionary.share.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={downloadStoryCard}
            disabled={isDownloading}
            className="gap-2"
          >
            <Download className="size-4" />
            {dictionary.share.downloadStoryCard}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={copyCaption}
            className="gap-2"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? dictionary.share.copied : dictionary.share.copyCaption}
          </Button>
        </div>
      </div>
    </section>
  );
}
