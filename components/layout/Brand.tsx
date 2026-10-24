import Link from "next/link";
import { site } from "@/data/site";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label={`${site.name} — Ana Sayfa`}>
      <span className="brand-monogram" aria-hidden="true">
        YD
      </span>
      <span>{site.name}</span>
    </Link>
  );
}
