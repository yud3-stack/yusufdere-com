import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageIntro({ title, description, eyebrow = "Yusuf Dere" }: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="intro-description">{description}</p>
    </header>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="back-link"><ArrowLeft size={16} aria-hidden="true" />{label.replace(/^←\s*/, "")}</Link>;
}
