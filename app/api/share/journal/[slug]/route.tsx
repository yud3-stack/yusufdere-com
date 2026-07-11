import type { NextRequest } from "next/server";

import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/lib/locale";
import { getJournalPostBySlug } from "@/lib/sanity/data";
import { createStoryShareImage } from "@/lib/share-card";

type ShareJournalRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: ShareJournalRouteContext,
) {
  const { slug } = await params;
  const locale = getLocale(request.nextUrl.searchParams.get("locale"));
  const format = request.nextUrl.searchParams.get("format") || "story";

  if (format !== "story") {
    return new Response("Unsupported share card format.", { status: 400 });
  }

  const post = await getJournalPostBySlug(slug, locale);

  if (!post) {
    return new Response("Journal post not found.", { status: 404 });
  }

  return createStoryShareImage({
    logoUrl: new URL("/brand/yd-logo.svg", request.url).toString(),
    contentTypeLabel: getDictionary(locale).share.journal,
    title: post.title,
    description: post.excerpt,
  });
}

function getLocale(value: string | null): Locale {
  const locale = value || undefined;

  return isLocale(locale) ? locale : "en";
}
