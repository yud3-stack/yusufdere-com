import Link from "next/link";
import { ArrowUpRight, CodeXml, Layers, Sparkles } from "lucide-react";
import { PortraitCutout } from "@/components/scene/PortraitCutout";
import { site } from "@/data/site";

const focusAreas = [
  {
    title: "Web Development",
    text: "React ve Next.js ile uygulamalar, araçlar ve kişisel ürünler.",
    icon: CodeXml,
    tone: "lime" as const,
    className: "about-orbit-web",
  },
  {
    title: "Desktop & Mobile",
    text: "İhtiyaç oldukça masaüstü ve mobil tarafı da aynı sistemde birleştiriyorum.",
    icon: Layers,
    tone: "peach" as const,
    className: "about-orbit-apps",
  },
  {
    title: "AI & Tools",
    text: "Otomasyonlar, yapay zekâ araçları ve geliştirme sürecini hızlandıran yardımcılar.",
    icon: Sparkles,
    tone: "lilac" as const,
    className: "about-orbit-ai",
  },
];

export function AboutScene() {
  return (
    <section className="portrait-hero about-scene" aria-labelledby="about-title">
      <div className="portrait-heading">
        <h1 id="about-title">
          <span className="portrait-title-line">{site.name}</span>
          <br />
          <em>{site.role}</em>
        </h1>
        <p className="portrait-description">{site.aboutSummary}</p>
      </div>

      <div className="hero-seal" aria-hidden="true">
        <span>Daha iyi bir yarın</span>
        <b>✳</b>
        <span>Daha fazla üretim</span>
      </div>

      <div className="portrait-stage">
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
        <div className="orbit-glass orbit-glass-left" aria-hidden="true" />
        <div className="orbit-glass orbit-glass-right" aria-hidden="true" />

        <PortraitCutout />

        {focusAreas.map(({ title, text, icon: Icon, tone, className }) => (
          <article key={title} className={`floating-card about-info-card ${className}`}>
            <div className="floating-card-top">
              <span className={`floating-icon ${tone}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="card-kicker">Odak</span>
            </div>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}

        <Link href="/projects" className="floating-card about-orbit-projects">
          <div className="floating-card-top">
            <span className="card-kicker">
              Projeler <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </div>
          <h2>Fikirden ürüne.</h2>
          <p>Geliştirdiğim işlere bak.</p>
        </Link>

        <Link href="/blog" className="floating-card about-orbit-journal">
          <span className="card-kicker">
            Journal <ArrowUpRight size={13} aria-hidden="true" />
          </span>
          <h2>Öğrendiklerimi paylaşıyorum.</h2>
        </Link>
      </div>

      <div className="portrait-footnote">
        <span className="footnote-rule" />
        Samsun, Türkiye
        <br />
        <span>Building the life I imagined.</span>
      </div>

      {site.instagramUrl ? (
        <a
          className="portrait-social"
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="footnote-rule" />
          @yusufderecom <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      ) : null}
    </section>
  );
}
