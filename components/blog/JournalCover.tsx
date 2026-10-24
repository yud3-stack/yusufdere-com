"use client";

import Image from "next/image";
import { useState } from "react";
import { Asterisk } from "lucide-react";

export function JournalCover({
  src,
  title,
  thumbnail = false,
}: {
  src: string | null;
  title: string;
  thumbnail?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed)
    return (
      <span className="journal-cover-placeholder" aria-hidden="true">
        <Asterisk strokeWidth={1} />
        <span>Yusuf Dere / Notlar</span>
      </span>
    );

  return (
    <Image
      src={src}
      alt={thumbnail ? "" : title}
      fill
      sizes={
        thumbnail
          ? "120px"
          : "(min-width: 1600px) 760px, (min-width: 900px) 52vw, 100vw"
      }
      priority={!thumbnail}
      unoptimized={/^https?:/.test(src)}
      onError={() => setFailed(true)}
    />
  );
}
