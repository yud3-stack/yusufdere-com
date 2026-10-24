import type { NextConfig } from "next";
import { developmentOrigins } from "./lib/dev-origins.ts";

function coverImageRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!raw) {
    return [];
  }

  try {
    const url = new URL(raw);
    const protocol = url.protocol === "http:" ? "http" : "https";

    return ["blog-covers", "post-assets", "project-covers"].map((bucket) => ({
      protocol,
      hostname: url.hostname,
      pathname: `/storage/v1/object/public/${bucket}/**`,
    }));
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  // LAN phone/tablet preview: npm run dev -- --hostname 0.0.0.0
  allowedDevOrigins: developmentOrigins(),
  images: {
    remotePatterns: coverImageRemotePatterns(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
