import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CodeXml } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { site } from "@/data/site";
import { getPublishedPosts, getPublishedProjects } from "@/lib/supabase/queries";

export async function Hero() {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getPublishedProjects()]);

  return (
    <section className="hero-band">
      <Container className="split-hero">
        <div className="hero-copy">
          <p className="eyebrow">BLOG &amp; PROJELER</p>
          <h1>Yazıyorum,<br />Geliştiriyorum,<br /><span>Paylaşıyorum.</span></h1>
          <p className="hero-description">
            Web geliştirme, yazılım projeleri ve karşılaştığım teknik problemler üzerine yazıyor;
            geliştirdiğim projeleri burada paylaşıyorum.
          </p>
          <div className="button-row">
            <Link href="/blog" className="button button-accent">Son Yazıları Gör<ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="/projects" className="button button-secondary">Projelerimi İncele</Link>
          </div>
          {posts.data || projects.data ? (
            <dl className="hero-stats">
              {posts.data ? <div><dt>Yayınlanmış yazı</dt><dd>{posts.data.length}</dd></div> : null}
              {projects.data ? <div><dt>Yayınlanmış proje</dt><dd>{projects.data.length}</dd></div> : null}
            </dl>
          ) : null}
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <Image
              src="/images/hero/workspace.jpg"
              alt="Kod editörü açık dizüstü bilgisayarın bulunduğu çalışma alanı"
              fill
              priority
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="hero-identity">
            <span className="identity-icon"><CodeXml size={21} aria-hidden="true" /></span>
            <div><p>{site.role}</p><span>{site.focus}</span></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
