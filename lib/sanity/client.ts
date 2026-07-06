import { createClient, type QueryParams } from "next-sanity";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-07-05";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const sanityRevalidateSeconds = 60;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = sanityRevalidateSeconds,
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  const effectiveRevalidate =
    process.env.NODE_ENV === "production" ? revalidate : 0;

  // Code changes still require a deploy. CMS content changes do not; Sanity data revalidates every 60 seconds in production.
  return client.fetch(query, params, {
    next: {
      revalidate: effectiveRevalidate,
      tags,
    },
  });
}

function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }

  return value;
}
