import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ title, href, label }: {
  title: string;
  href: string;
  label: string;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <Link href={href}>{label}<ArrowRight size={17} aria-hidden="true" /></Link>
    </div>
  );
}
