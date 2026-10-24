import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

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

/** Keep this inline — next.config.ts cannot reliably import other .ts files on Vercel. */
function developmentOrigins() {
  const lan = Object.values(networkInterfaces())
    .flatMap((entries) => entries ?? [])
    .filter((entry) => entry.family === "IPv4" && !entry.internal)
    .map((entry) => entry.address);
  return [...new Set(["25.44.12.64", ...lan])];
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
