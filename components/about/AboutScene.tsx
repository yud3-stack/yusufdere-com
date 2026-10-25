import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortraitCutout } from "@/components/scene/PortraitCutout";
import { about } from "@/data/about";
import { site } from "@/data/site";
import "@/app/about-scene.css";

export function AboutScene() {
  return (
    <section className="portrait-hero about-editorial" data-scene="about" aria-labelledby="about-title">
      <div className="about-portrait-column">
        <p className="about-eyebrow">{about.eyebrow}</p>
        <div className="about-portrait-backdrop" aria-hidden="true" />
        <div className="portrait-stage"><PortraitCutout /></div>
        <div className="about-portrait-caption">
          <span className="about-caption-rule" aria-hidden="true" />
          <span>{site.name}</span><span>{about.location}</span>
        </div>
      </div>
      <div className="about-editorial-copy">
        <h1 id="about-title">{about.title}<br /><em>{about.emphasis}</em></h1>
        <div className="about-biography"><p>{about.introduction}</p><p>{about.story}</p></div>
        <ol className="about-focus-list" aria-label="Çalışma alanlarım">
          {about.areas.map((area, index) => (
            <li key={area.title}>
              <span className="about-focus-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h2>{area.title}</h2><p>{area.description}</p></div>
            </li>
          ))}
        </ol>
        <div className="about-editorial-bottom">
          <nav className="about-editorial-links" aria-label="Beni keşfet">
            {about.links.map((link) => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
          </nav>
          <p className="about-signature">{about.signature}</p>
        </div>
      </div>
    </section>
  );
}
