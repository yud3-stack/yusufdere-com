import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight, BookOpen, Layers, Lightbulb } from "lucide-react";
import { QuoteCard } from "@/components/home/QuoteCard";
import { HeroPanels } from "@/components/home/HeroPanels";
import { PortraitCutout } from "@/components/scene/PortraitCutout";
import { heroContent } from "@/data/hero";
import { todayQuote } from "@/lib/quotes/store";
import {
  getPublishedPosts,
  getPublishedProjects,
} from "@/lib/supabase/queries";

export async function HomeScene() {
  // Render the date per request while public content and the daily snapshot cache.
  await connection();
  const [posts, projects, publication] = await Promise.all([
    getPublishedPosts(),
    getPublishedProjects(),
    todayQuote(),
  ]);
  const project =
    projects.data?.find((item) => item.featured) ?? projects.data?.[0];
  const post = posts.data?.[0];

  return (
    <section className="portrait-hero scene-home" data-scene="home" aria-labelledby="hero-title">
      <div className="portrait-heading">
        <h1 id="hero-title">
          <span className="portrait-title-line">{heroContent.title}</span>
          <br />
          <em>{heroContent.titleEmphasis}</em>
        </h1>
        <p className="portrait-description">{heroContent.description}</p>
      </div>
      <div className="hero-seal" aria-hidden="true">
        <span>Daha iyi bir yarın</span>
        <b>✳</b>
        <span>Daha fazla üretim</span>
      </div>
      <div className="portrait-stage">
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
        <HeroPanels />
        <div className="orbit-glass orbit-glass-left" aria-hidden="true" />
        <div className="orbit-glass orbit-glass-right" aria-hidden="true" />
        <PortraitCutout />
        <Link href="/about" className="floating-card focus-card">
          <div className="floating-card-top">
            <span className="floating-icon lime">
              <Lightbulb size={20} aria-hidden="true" />
            </span>
            <span className="card-kicker">
              Şu sıralar <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </div>
          <h2>{heroContent.focusTitle}</h2>
          <p>{heroContent.focusDescription}</p>
        </Link>
        <QuoteCard initialDate={publication.date} initialQuote={publication.quote} />
        <Link
          href={project ? `/projects/${project.slug}` : "/projects"}
          className="floating-card featured-orbit-card"
        >
          <div className="floating-card-top">
            <span className="floating-icon peach">
              <Layers size={19} aria-hidden="true" />
            </span>
            <span className="card-kicker">
              Seçili proje <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </div>
          <h2>{project?.title ?? "Fikirden ürüne."}</h2>
          <p>
            {project ? "Hikâyesini keşfet." : "Üzerinde çalıştığım projeler."}
          </p>
        </Link>
        {post ? (
          <Link
            href={`/blog/${post.slug}`}
            className="floating-card latest-orbit-card"
          >
            <span className="card-kicker">
              <BookOpen size={14} aria-hidden="true" /> Son yazı{" "}
              <ArrowUpRight size={13} aria-hidden="true" />
            </span>
            <h2>{post.title}</h2>
          </Link>
        ) : null}
      </div>
      <div className="portrait-footnote">
        <span className="footnote-rule" />
        Samsun, Türkiye
        <br />
        <span>Building the life I imagined.</span>
      </div>
      <a
        className="portrait-social"
        href="https://www.instagram.com/yusufderecom"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="footnote-rule" />
        @yusufderecom <ArrowUpRight size={12} aria-hidden="true" />
      </a>
    </section>
  );
}
