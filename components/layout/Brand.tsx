import Link from "next/link";
import { CodeXml } from "lucide-react";
import { site } from "@/data/site";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label={`${site.name} — Ana Sayfa`}>
      <CodeXml aria-hidden="true" />
      <span>{site.name}<span className="brand-dot">.</span></span>
    </Link>
  );
}
