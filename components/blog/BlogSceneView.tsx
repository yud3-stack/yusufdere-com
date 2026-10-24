"use client";

import { BlogSceneRail } from "@/components/blog/BlogSceneRail";
import type { JournalEntry } from "@/components/blog/JournalShowcase";
import { PortraitCutout } from "@/components/scene/PortraitCutout";
import { journal } from "@/data/journal";

export function BlogSceneView({
  posts,
  error,
}: {
  posts: JournalEntry[];
  error: boolean;
}) {
  return (
    <section
      className="portrait-hero scene-blog"
      data-scene="blog"
      aria-labelledby="journal-heading"
    >
      <div className="scene-blog-copy">
        <header className="scene-blog-heading">
          <p className="eyebrow">{journal.eyebrow}</p>
          <h1 id="journal-heading">
            {journal.title}
            <br />
            <em>{journal.titleEmphasis}</em>
          </h1>
          <p className="scene-blog-description">{journal.description}</p>
        </header>
        <div className="scene-blog-rail">
          <BlogSceneRail posts={posts} error={error} />
        </div>
      </div>

      <div className="portrait-stage">
        <PortraitCutout />
      </div>
    </section>
  );
}
