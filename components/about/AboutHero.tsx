import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { site } from "@/data/site";

export function AboutHero() {
  return (
    <section className="about-hero">
      <Container>
        <p className="eyebrow">{site.name}</p>
        <h1>
          Yazılım geliştiriyorum; web ise en çok çalıştığım alan.
        </h1>
        <p className="intro-description">
          Web geliştirme ağırlıklı çalışıyorum; bunun yanında masaüstü, mobil ve yapay zekâ tabanlı projeler de
          geliştiriyorum.
        </p>
        <p className="about-role">
          <span className="font-medium">{site.role}</span>
          <span> · {site.focus}</span>
        </p>
        <div className="button-row">
          <Link
            href="/projects"
            className="button button-accent"
          >
            Projelerimi İncele
          </Link>
          <Link
            href="/blog"
            className="button button-secondary"
          >
            Blog Yazılarım
          </Link>
        </div>
      </Container>
    </section>
  );
}
