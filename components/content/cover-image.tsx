"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

type CoverImageProps = {
  src: string | null;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
};

function isStorageCover(src: string) {
  const env = getSupabasePublicEnv();
  if (!env) return false;

  try {
    const imageUrl = new URL(src);
    const supabaseUrl = new URL(env.url);
    return imageUrl.hostname === supabaseUrl.hostname &&
      (imageUrl.pathname.startsWith("/storage/v1/object/public/blog-covers/") || imageUrl.pathname.startsWith("/storage/v1/object/public/project-covers/"));
  } catch {
    return false;
  }
}

function CoverContent({ src, alt, className, sizes, priority = false }: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const message = failed ? "Görsel yüklenemedi" : "Kapak görseli yok";
    return (
      <div className={`cover-empty ${className}`} role="img" aria-label={`${alt}: ${message}`}>
        <ImageOff size={30} aria-hidden="true" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill unoptimized={!isStorageCover(src)} priority={priority} sizes={sizes} className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" onError={() => setFailed(true)} />
    </div>
  );
}

export function CoverImage(props: CoverImageProps) {
  return <CoverContent key={props.src ?? "missing"} {...props} />;
}
