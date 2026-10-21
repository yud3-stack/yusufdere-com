import Link from "next/link";
import { CodeXml, FileText, Folder, LayoutGrid } from "lucide-react";
import { Container } from "@/components/layout/Container";

const sections = [
  { href: "/", label: "Tümü", icon: LayoutGrid },
  { href: "#son-yazilar", label: "Yazılar", icon: FileText },
  { href: "#projeler", label: "Projeler", icon: Folder },
  { href: "/about", label: "Hakkımda", icon: CodeXml },
];

export function SectionNav() {
  return (
    <Container>
      <nav className="section-nav" aria-label="İçeriği keşfet">
        {sections.map(({ href, label, icon: Icon }, index) => (
          <Link key={href} href={href} className={index === 0 ? "selected" : undefined}>
            <Icon size={20} aria-hidden="true" /><span>{label}</span>
          </Link>
        ))}
      </nav>
    </Container>
  );
}
