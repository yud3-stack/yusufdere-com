import type { NextRequest } from "next/server";

import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/lib/locale";
import { getProjectBySlug } from "@/lib/sanity/data";
import { createStoryShareImage } from "@/lib/share-card";

type ShareProjectRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: ShareProjectRouteContext,
) {
  const { slug } = await params;
  const locale = getLocale(request.nextUrl.searchParams.get("locale"));
  const format = request.nextUrl.searchParams.get("format") || "story";

  if (format !== "story") {
    return new Response("Unsupported share card format.", { status: 400 });
  }

  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    return new Response("Project not found.", { status: 404 });
  }

  return createStoryShareImage({
    logoUrl: new URL("/brand/yd-logo.svg", request.url).toString(),
    contentTypeLabel: getDictionary(locale).share.project,
    title: project.title,
    description: project.shortDescription,
  });
}

function getLocale(value: string | null): Locale {
  const locale = value || undefined;

  return isLocale(locale) ? locale : "en";
}
